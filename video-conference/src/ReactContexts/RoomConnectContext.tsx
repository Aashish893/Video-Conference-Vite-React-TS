import Peer, { MediaConnection } from "peerjs";
import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useReducer,
} from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { userReducer } from "../Reducers/userReducer";
import { addUserAction, removeUserAction } from "./userActions";
import { MessageType } from "../tyeps/chat";

const WS_Url = "ws://localhost:8080";

const ws = new WebSocket(WS_Url);

export const RoomContext = createContext<null | any>(null);

interface Props {
  children: ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [allUsers, dispatch] = useReducer(userReducer, {});
  const [sharedScreenID, setSharedScreenID] = useState<String>();
  const [connections, setConnections] = useState<Map<string, MediaConnection>>(
    new Map()
  );
  const [roomId, setRoomId] = useState<string>();

  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log(participants);
  };

  const removeUser = (userId: string) => {
    dispatch(removeUserAction(userId));
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
  const handleMessage = (message: any) => {
    if (message.type === "createRoomSuccess") {
      enterRoom({ roomId: message.roomID });
    }
    if (message.type === "getUsers") {
      getUsers({ participants: message.participants });
    }
    if (message.type === "userJoined") {
      console.log("This user Joined", message.userID);
      if (user && stream) {
        const call = user.call(message.userID, stream);
        call.on("stream", (userStream) => {
          dispatch(addUserAction(message.userID, userStream));
        });
        addConnection(message.userID, call);
      }
    }
    if (message.type === "userLeft") {
      removeUser(message.userID);
    }
    if (message.type === "user-started-sharing") {
      setSharedScreenID(message.userID);
    }
    if (message.type === "user-stopped-sharing") {
      setSharedScreenID("");
    }
    if (message.type === "chat-message") {
      console.log(message.messageContent);
    }
  };
  //Sharing The Screen
  const switchStream = (stream: MediaStream) => {
    setStream(stream);
    setSharedScreenID(user?.id || "");
    console.log(connections);
    connections.forEach((connection) => {
      const videoStream = stream
        .getTracks()
        .find((track) => track.kind === "video");
      const sender = connection.peerConnection.getSenders()[1];
      if (sender && videoStream) {
        sender
          .replaceTrack(videoStream)
          .catch((err) => console.error("Failed to replace video track", err));
      }
    });
  };

  const screenShare = () => {
    if (sharedScreenID) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then(switchStream);
    }
  };

  //Chat
  const sendMessage = (message: string) => {
    const messageData: MessageType = {
      content: message,
      author: user?.id || "",
      timestamp: new Date().getTime(),
    };
    console.log(message);
    ws.send(
      JSON.stringify({
        type: "sendMessage",
        roomID: roomId,
        message: messageData,
      })
    );
  };

  useEffect(() => {
    const userId = uuidV4();
    const newUser = new Peer(userId, {
      host: "localhost",
      port: 9001,
      path: "/",
    });
    setUser(newUser);
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
    console.log(userId);
    // Function to handle WebSocket messages
    const handleWebSocketMessage = (event: any) => {
      const message = JSON.parse(event.data.toString());
      handleMessage(message);
    };

    // Subscribe to WebSocket messages
    ws.addEventListener("message", handleWebSocketMessage);

    // Cleanup function
    return () => {
      // Unsubscribe from WebSocket messages
      ws.removeEventListener("message", handleWebSocketMessage);
    };
  }, []);

  useEffect(() => {
    if (sharedScreenID) {
      console.log("Sending shared ID");
      ws.send(
        JSON.stringify({
          type: "startSharing",
          userID: sharedScreenID,
          roomID: roomId,
        })
      );
    } else {
      setTimeout(() => {
        ws.send(JSON.stringify({ type: "stopSharing", roomID: roomId }));
      }, 200);
    }
  }, [sharedScreenID, roomId]);

  useEffect(() => {
    if (!user) return;
    if (!stream) return;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());

      handleMessage(message);
    };
    user.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userStream) => {
        dispatch(addUserAction(call.peer, userStream));
      });
      addConnection(call.peer, call);
    });
  }, [user, stream]);

  return (
    <RoomContext.Provider
      value={{
        ws,
        user,
        stream,
        allUsers,
        screenShare,
        sharedScreenID,
        setRoomId,
        sendMessage,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
