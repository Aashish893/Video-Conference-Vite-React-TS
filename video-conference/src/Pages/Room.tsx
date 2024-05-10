import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";
import { VideoCall } from "../components/VideoCall";
import { UserState } from "../Reducers/userReducer";
import '../Styles/Room.css'
import { ScreenShareButton } from "../components/ScreenShareButton";


const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { ws,user, stream, allUsers, screenShare, sharedScreenID, setRoomId } = useContext(RoomContext);
  console.log(allUsers);
  console.log(sharedScreenID);
  
  useEffect(() => {

    if(user){
      setTimeout(() => {
        ws.send(JSON.stringify({type : "joinRoom" , roomID : id, userID : user._id}));
      },200)
    }
  }, [id,user,ws]);

  useEffect(() =>{
    
    setRoomId(id);
  },[id,setRoomId]);

  const screenSharedVideo = sharedScreenID === user?.id? stream: allUsers[sharedScreenID]?.stream;

  const{[sharedScreenID]: sharing,...usersToShow} = allUsers;
  return (
    <>
    Room Id : {id}
    <div className="flex">
      {screenSharedVideo &&(
        <div className="w-4/5 pr-4">
          <VideoCall stream = {screenSharedVideo}/>
        </div>
      )}
      <div className={`grid grid-cols-4 gap-4 ${screenSharedVideo ? "w-1/5 grid-cols-1": "grid-cols-4"}`}>
        {sharedScreenID !== user?.id && (
          <VideoCall stream = {stream}/>
        )}
        {Object.values(usersToShow as UserState).map((peer) => (
          <VideoCall stream={peer.stream} />
        ))}
    
      </div>
    </div>

      <div className="fixed bottom-0 p-6 w-full flex justify-center border-t-2">
        <ScreenShareButton onClick={screenShare} />
      </div>
    </>
  );
};

export default RoomDisplay;
