import Peer, { MediaConnection } from "peerjs";
import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { userReducer, UserState } from "../Reducers/userReducer";
import {
  addUserAction,
  removeUserStreamAction,
  addUserNameAction,
  addAllUsersAction,
} from "../Reducers/userActions";
import { UserContext } from "./UserContext";
import { ws } from "../ws";
import { IUser } from "../types/users";
import global from "../types/window";
interface RoomProps {
  stream?: MediaStream;
  allUsers: UserState;
  shareStream?: MediaStream;
  screenShare: () => void;
  sharedScreenID: string;
  setRoomId: (id: string) => void;
  roomId: string;
}

if (!!window.Cypress) {
  window.Peer = Peer;
}

export const RoomContext = createContext<RoomProps>({
  allUsers: {},
  screenShare: () => {},
  sharedScreenID: "",
  setRoomId: (id: string) => {},
  roomId: "",
});

interface Props {
  children: ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [user, setUser] = useState<Peer>();
  const { userId, userName } = useContext(UserContext);
  const [stream, setStream] = useState<MediaStream>();
  const [shareStream, setShareStream] = useState<MediaStream>();
  const [allUsers, dispatch] = useReducer(userReducer, {});
  const [sharedScreenID, setSharedScreenID] = useState<string>("");

  const [connections, setConnections] = useState<Map<string, MediaConnection>>(
    new Map()
  );
  const [roomId, setRoomId] = useState<string>("");
  const [prevUserName, setPrevUserName] = useState<string>(userName);

  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IUser>;
  }) => {
    dispatch(addAllUsersAction(participants));
  };

  const removeUser = (userId: string) => {
    dispatch(removeUserStreamAction(userId));
    removeConnection(userId);
  };

  const addConnection = (peerId: string, connection: MediaConnection) => {
    setConnections((prev) => new Map(prev).set(peerId, connection));
  };

  const removeConnection = (peerId: string) => {
    setConnections((prev) => {
      const newConnections = new Map(prev);
      newConnections.delete(peerId);
      return newConnections;
    });
  };

  const nameChangeHandler = ({
    userId,
    userName,
  }: {
    userId: string;
    userName: string;
  }) => {
    dispatch(addUserNameAction(userId, userName));
  };

  const handleMessage = (message: any) => {
    console.log("Received message:", message);
    switch (message.type) {
      case "createRoomSuccess":
        enterRoom({ roomId: message.roomID });
        break;
      case "getUsers":
        getUsers({ participants: message.participants });
        break;
      case "userLeft":
        removeUser(message.userID);
        break;
      case "user-started-sharing":
        setSharedScreenID(message.userID);
        break;
      case "user-stopped-sharing":
        setSharedScreenID("");
        break;
      case "name-changed":
        nameChangeHandler({
          userId: message.messageContent.userId,
          userName: message.messageContent.userName,
        });
        break;
      default:
        console.warn("Unhandled message type:", message.type);
    }
  };

  // Sharing The Screen
  const switchStream = (newStream: MediaStream) => {
    setSharedScreenID(user?.id || "");
    connections.forEach((connection) => {
      const videoTrack = newStream
        ?.getTracks()
        .find((track) => track.kind === "video");

      const sender = connection.peerConnection
        .getSenders()
        .find((sender) => sender.track?.kind === "video");

      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack).catch((err) => console.log(err));
      }
    });
  };

  const stopStream = (stream: MediaStream) => {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  const screenShare = async () => {
    try {
      if (shareStream) {
        stopStream(shareStream);

        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        ws.send(
          JSON.stringify({
            type: "stopSharing",
            userID: userId,
            roomID: roomId,
          })
        );

        switchStream(cameraStream);
        setShareStream(undefined);
        setSharedScreenID("");
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({});

        ws.send(
          JSON.stringify({
            type: "startSharing",
            userID: userId,
            roomID: roomId,
          })
        );

        switchStream(screenStream);
        setShareStream(screenStream);
        setSharedScreenID(userId || "");

        screenStream.getVideoTracks()[0].addEventListener("ended", async () => {
          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });

            ws.send(
              JSON.stringify({
                type: "stopSharing",
                userID: userId,
                roomID: roomId,
              })
            );

            switchStream(cameraStream);
            setShareStream(undefined);
            setSharedScreenID("");
          } catch (error) {
            console.error("Error getting camera stream: ", error);
          }
        });
      }
    } catch (error) {
      console.error("Error during screen sharing: ", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    if (
      ws.readyState === WebSocket.OPEN &&
      roomId &&
      userName !== prevUserName
    ) {
      ws.send(
        JSON.stringify({
          type: "userChangedName",
          userId: userId,
          userName: userName,
          roomId: roomId,
        })
      );
      setPrevUserName(userName);
    }
  }, [userName, roomId, prevUserName]);

  useEffect(() => {
    const newUser = new Peer(userId, {
      host: "localhost",
      port: 9001,
      path: "/",
    });

    newUser.on("open", (id) => {
      setUser(newUser);
    });

    newUser.on("error", (err) => {
      console.error(`Peer connection error: ${err.type} - ${err.message}`);
    });

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }

    const handleWebSocketMessage = (event: any) => {
      const message = JSON.parse(event.data.toString());
      handleMessage(message);
    };

    ws.addEventListener("message", handleWebSocketMessage);

    return () => {
      ws.removeEventListener("message", handleWebSocketMessage);
      newUser.destroy();
    };
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());
      if (message.type === "userJoined") {
        if (user) {
          const call = user.call(message.userID, shareStream || stream, {
            metadata: {
              userName,
            },
          });

          call.on("stream", (userStream) => {
            dispatch(addUserAction(message.userID, userStream));
          });

          dispatch(addUserNameAction(message.userID, message.UN));
          addConnection(message.userID, call);
        }
      }
    };

    user.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addUserNameAction(call.peer, userName));

      let mediaStream = shareStream || stream;

      if (mediaStream) {
        call.answer(mediaStream);
        call.on("stream", (userStream) => {
          dispatch(addUserAction(call.peer, userStream));
        });
        addConnection(call.peer, call);
        dispatch(addUserNameAction(call.peer, call.metadata.userName));
      }
    });
  }, [stream, user, shareStream, sharedScreenID, roomId, userName]);

  console.log(allUsers);
  const value = {
    stream,
    allUsers,
    screenShare,
    shareStream,
    sharedScreenID,
    setRoomId,
    roomId,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
