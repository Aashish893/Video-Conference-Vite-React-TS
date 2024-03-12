import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";

const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { ws } = useContext(RoomContext);
  useEffect(() => {
    console.log(ws)
    if (ws) {
      ws.onopen = () => {
        console.log(id);
        ws.send(JSON.stringify({type : "joinRoom" , roomID : id}));
      };
    }
  }, [id]);

  return (
    <div>
      <p>Room ID: {id}</p>
    </div>
  );
};

export default RoomDisplay;
