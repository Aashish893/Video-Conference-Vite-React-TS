import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";

const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { ws,user } = useContext(RoomContext);
  console.log(ws,user)
  useEffect(() => {
    console.log(ws);
    console.log(id);
    console.log(user);
    ws.onopen = () =>{
      console.log("reached on open");
      if(user)ws.send(JSON.stringify({type : "joinRoom" , roomID : id, userID : user._id}));
    }      
  }, [id,ws,user]);

  return (
    <div>
      <p>Room ID:</p>
    </div>
  );
};

export default RoomDisplay;
