import Peer from "peerjs";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const WS_Url = "ws://localhost:8080";

const ws = new WebSocket(WS_Url);


export const RoomContext = createContext<null | any>(null);

interface Props {
  children: ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
  const [user, setUser] = useState<Peer>();

  const navigate = useNavigate();

  const enterRoom = (roomId: string) => {
    console.log(roomId);
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    const userId = uuidV4();
    const newUser = new Peer(userId);
    setUser(newUser);
    console.log(newUser,user);
    console.log(ws)
    ws.onmessage = (event) => {    
        const message = JSON.parse(event.data.toString());
        console.log(message.roomID);
        if (message.type === "createRoomSuccess") {
          enterRoom(message.roomID);
        }
      }
  }, []);

  return (<RoomContext.Provider value={{ ws,user }}>{children}</RoomContext.Provider>);
};
