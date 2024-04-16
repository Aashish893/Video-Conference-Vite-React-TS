import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";
import { VideoCall } from "../components/VideoCall";
import { UserState } from "../Reducers/userReducer";
import '../Styles/Room.css'
import { ScreenShareButton } from "../components/ScreenShareButton";


const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { ws,user, stream, allUsers, screenShare } = useContext(RoomContext);


  useEffect(() => {

    if(user){
      setTimeout(() => {
        ws.send(JSON.stringify({type : "joinRoom" , roomID : id, userID : user._id}));
      },2000)
    }
  }, [id,user,ws]);


  return (
    <>
    Room Id : {id}
    <div className="grid grid-cols-4 gap-4" >
        <VideoCall stream={stream} />
        {Object.values(allUsers as UserState).map((peer) => (
          <VideoCall stream={peer.stream} />
        ))}
    
      </div>
      <div className="fixed bottom-0 p-6 w-full flex justify-center border-t-2">
        <ScreenShareButton onClick={screenShare} />
      </div>
    </>
  );
};

export default RoomDisplay;
