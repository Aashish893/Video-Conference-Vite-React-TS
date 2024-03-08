import { createContext, ReactNode, useEffect} from "react";
import { useNavigate } from "react-router-dom";


const WS_URL = "ws://localhost:8080";

export const roomContext = createContext<null | any>(null);

const ws = new WebSocket(WS_URL);

interface Props {
    children: ReactNode;
  }

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {

  const navigate = useNavigate();

  const enterRoom = ({roomId} : {roomId:'strign'}) =>{
    console.log("entered the room",roomId);
    navigate(`/room/${roomId}`);
  }
  useEffect( () => {
    ws.onmessage = (event) =>{
      var message=JSON.parse(event.data);
      console.log(message);
      if(message.roomcreated){
        //enter room with messaag
        enterRoom({ roomId: message.roomcreated.toString() });
      }
    }
  },[] );

  return (
    <roomContext.Provider value={{ ws }}>
      {children}
    </roomContext.Provider>
  );
};