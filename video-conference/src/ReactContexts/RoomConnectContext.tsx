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
// import { chatReducer } from "../Reducers/chatReducer";
// import { MessageType } from "../types/chat";
// import {
//   addHistoryAction,
//   addMessageAction,
//   toggleChatAction,
// } from "../Reducers/chatActions";
import { UserContext } from "./UserContext";
import { ws } from "../ws";
import { IUser } from "../types/users";

// const WS_Url = "ws://localhost:8080";

// const ws = new WebSocket(WS_Url);

interface RoomProps {
  stream?: MediaStream;
  allUsers: UserState;
  screenShare: () => void;
  sharedScreenID: string;
  setRoomId: (id: string) => void;
  roomId: string;
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
  // const [chat, chatDispatch] = useReducer(chatReducer, {
  //   messages: [],
  //   isChatOpen: false,
  // });
  const [allUsers, dispatch] = useReducer(userReducer, {});
  const [sharedScreenID, setSharedScreenID] = useState<string>("");
  const [connections, setConnections] = useState<Map<string, MediaConnection>>(
    new Map()
  );
  const [roomId, setRoomId] = useState<string>("");

  const navigate = useNavigate();

  const enterRoom = ({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IUser>;
  }) => {
    console.log(participants, " GETTING USERS");
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
    console.log(userName);
    dispatch(addUserNameAction(userId, userName));
  };

  const handleMessage = (message: any) => {
    if (message.type === "createRoomSuccess") {
      enterRoom({ roomId: message.roomID });
    }
    if (message.type === "getUsers") {
      getUsers({ participants: message.participants });
    }
    // if (message.type === "userJoined") {
    //   console.log("This user Joined", message.userID);
    //   if (user && stream) {
    //     const call = user.call(message.userID, stream);
    //     call.on("stream", (userStream) => {
    //       dispatch(addUserAction(message.userID, userStream));
    //     });
    //     addConnection(message.userID, call);
    //   }
    // }
    if (message.type === "userLeft") {
      removeUser(message.userID);
    }
    if (message.type === "user-started-sharing") {
      setSharedScreenID(message.userID);
    }
    if (message.type === "user-stopped-sharing") {
      setSharedScreenID("");
    }
    if (message.type === "name-changed") {
      console.log(message);
      nameChangeHandler({
        userId: message.messageContent.userId,
        userName: message.messageContent.userName,
      });
    }
  };
  //Sharing The Screen
  const switchStream = (stream: MediaStream) => {
    setStream(stream);
    setSharedScreenID(userId || "");
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

  // useEffect(() => {
  //   const userId = uuidV4();
  //   const newUser = new Peer(userId, {
  //     host: "localhost",
  //     port: 9001,
  //     path: "/",
  //   });
  //   setUser(newUser);
  //   try {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: true })
  //       .then((stream) => {
  //         setStream(stream);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   console.log(userId);
  //   // Function to handle WebSocket messages
  //   const handleWebSocketMessage = (event: any) => {
  //     const message = JSON.parse(event.data.toString());
  //     handleMessage(message);
  //   };

  //   // Subscribe to WebSocket messages
  //   ws.addEventListener("message", handleWebSocketMessage);

  //   // Cleanup function
  //   return () => {
  //     // Unsubscribe from WebSocket messages
  //     ws.removeEventListener("message", handleWebSocketMessage);
  //   };
  // }, []);

  // useEffect(() => {
  //   let userId = localStorage.getItem("userId");
  //   if (!userId) {
  //     userId = uuidV4();
  //     localStorage.setItem("userId", userId);
  //   }

  //   const newUser = new Peer(userId, {
  //     host: "localhost",
  //     port: 9001,
  //     path: "/",
  //   });

  //   newUser.on("open", (id) => {
  //     console.log(`Peer connection established. Your peer ID is: ${id}`);
  //     setUser(newUser);
  //   });

  //   newUser.on("error", (err) => {
  //     console.error(`Peer connection error: ${err.type} - ${err.message}`);
  //   });

  //   try {
  //     navigator.mediaDevices
  //       .getUserMedia({ video: true, audio: true })
  //       .then((stream) => {
  //         setStream(stream);
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   const handleWebSocketMessage = (event: any) => {
  //     const message = JSON.parse(event.data.toString());
  //     handleMessage(message);
  //   };

  //   ws.addEventListener("message", handleWebSocketMessage);

  //   return () => {
  //     ws.removeEventListener("message", handleWebSocketMessage);
  //     newUser.destroy();
  //   };
  // }, []);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "userChangedName",
          userId: userId,
          userName: userName,
          roomId: roomId,
        })
      );
    } else {
      ws.addEventListener(
        "open",
        () => {
          ws.send(
            JSON.stringify({
              type: "userChangedName",
              userID: userId,
              userName: userName,
              roomId: roomId,
            })
          );
        },
        { once: true }
      );
    }
  }, [userName, roomId]);
  useEffect(() => {
    const newUser = new Peer(userId, {
      host: "localhost",
      port: 9001,
      path: "/",
    });

    newUser.on("open", (id) => {
      console.log(`Peer connection established. Your peer ID is: ${id}`);
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
      if (message.type === "userJoined") {
        console.log(message, " MESSAGE ON USER JOINED!!");
        if (user && stream) {
          const call = user.call(message.userID, stream, {
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
      // handleMessage(message);
    };

    user.on("call", (call) => {
      const { userName } = call.metadata.userName;
      dispatch(addUserNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (userStream) => {
        dispatch(addUserAction(call.peer, userStream));
      });
      addConnection(call.peer, call);
      dispatch(addUserNameAction(call.peer, call.metadata.userName));
    });
  }, [user, stream, userName]);

  console.log(allUsers);

  return (
    <RoomContext.Provider
      value={{
        stream,
        allUsers,
        screenShare,
        sharedScreenID,
        roomId,
        setRoomId,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
