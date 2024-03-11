import { ReactNode, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const WS_Url = "ws://localhost:8080";

export const RoomContext = createContext<null | any>(null);

const ws = new WebSocket(WS_Url);

interface Props {
    children : ReactNode;
}

export const RoomProvider : React.FunctionComponent<Props> = ({children}) => {

    const navigate = useNavigate();
    
    const enterRoom = (roomId : string) => {
      console.log(roomId);        
      navigate(`/room/${roomId}`);
    }
  
    useEffect(() => {
      ws.onmessage = (event) =>{ 
        const message = JSON.parse(event.data.toString());
        console.log(message.roomId);
        if (message.type === 'createRoomSuccess'){
          enterRoom(message.roomID);
        }
      }
    });

    return(
        <RoomContext.Provider value={{ws}}>
            {children}
        </RoomContext.Provider>
    )
}