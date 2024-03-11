import React, { createContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { ws } from "../ws";
export const roomContext = createContext<null | any>(null);


interface RoomContextProps {
  roomId: string | null;
  setRoomId: (roomId: string) => void;
  
}

export const RoomContext = createContext<RoomContextProps>({
  roomId: "" ,
  setRoomId: () => {},
});


interface Props {
  children: React.ReactNode;
}

export const RoomProvider : React.FunctionComponent<Props> = ({children}) => {

  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");

  const enterRoom = (roomId : string) => {
    console.log(roomId);  
    setRoomId(roomId);

    navigate(`/room/${roomId}`);
  }

  useEffect(() => {
    ws.onmessage = (event) =>{ 
      const message = JSON.parse(event.data.toString());
      console.log(message.id);
      if (message.type === 'createRoomSuccess'){
        enterRoom(message.id);
      }
    }

  });


  return(
    <RoomContext.Provider value={{roomId,setRoomId}}>
        {children}
    </RoomContext.Provider>
  );

}