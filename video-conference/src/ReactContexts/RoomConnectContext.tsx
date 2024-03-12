import { ReactNode, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WS_Url = "ws://localhost:8080";

export const RoomContext = createContext<null | any>(null);

interface Props {
  children: ReactNode;
}

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {

  const ws = new WebSocket(WS_Url);

  const navigate = useNavigate();

  const enterRoom = (roomId: string) => {
    console.log(roomId);
    navigate(`/room/${roomId}`);
  };


 // Empty dependency array means this effect runs only once on component mount

  // Reconnect WebSocket if it's closed
  useEffect(() => {
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data.toString());
        console.log(message.roomId);
        if (message.type === "createRoomSuccess") {
          enterRoom(message.roomID);
        }
      }
  }, [ws]);

  return (<RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>);
};
