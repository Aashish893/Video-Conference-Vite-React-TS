import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";
import { VideoCall } from "../components/VideoCall";
import { UserState } from "../Reducers/userReducer";
import '../Styles/Room.css';

const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { ws,user, stream, allUsers } = useContext(RoomContext);
  console.log(stream);
  useEffect(() => {

    if(user){
      setTimeout(() => {
        ws.send(JSON.stringify({type : "joinRoom" , roomID : id, userID : user._id}));
      },1000)
    }
  }, [id,user,ws]);

  return (
    <>
      Room ID:
      <div className=".grid-container"> 
        <VideoCall stream={stream}/>
        {Object.values(allUsers as UserState).map((peer) => (
          <VideoCall stream={peer.stream}/>
        ))}
      </div>
    </>
  );
};

export default RoomDisplay;
