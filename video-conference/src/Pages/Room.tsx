import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";

const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { ws,user } = useContext(RoomContext);
  useEffect(() => {
    console.log(ws);
    console.log(user);
    if(user)ws.send(JSON.stringify({type : "joinRoom" , roomID : id, userID : user._id}));
         
  }, [id,user,ws]);

  return (
    <div>
      <p>Room ID:</p>
    </div>
  );
};

export default RoomDisplay;
