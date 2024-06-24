import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";
import { VideoCall } from "../components/VideoCall";
import { UserState } from "../Reducers/userReducer";

import { ScreenShareButton } from "../components/ScreenShareButton";
import { ChatButton } from "../components/ChatButton";
import { Chat } from "../components/Chat/Chat";

const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const {
    ws,
    user,
    stream,
    allUsers,
    screenShare,
    sharedScreenID,
    setRoomId,
    toggleChat,
    chat,
    userName,
  } = useContext(RoomContext);
  console.log(user);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        ws.send(
          JSON.stringify({
            type: "joinRoom",
            roomID: id,
            userID: user._id || user._lastServerId,
            UN: userName,
          })
        );
      }, 1000);
    }
  }, [id, user, ws]);

  useEffect(() => {
    setRoomId(id);
  }, [id, setRoomId]);

  const screenSharedVideo =
    sharedScreenID === user?.id ? stream : allUsers[sharedScreenID]?.stream;

  const { [sharedScreenID]: sharing, ...usersToShow } = allUsers;
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="bg-blue-500 p-1">Room Id : {id}</div>
        <div className="flex grow">
          {screenSharedVideo && (
            <div className="w-4/5 pr-4">
              <VideoCall stream={screenSharedVideo} />
            </div>
          )}
          <div
            className={`grid grid-cols-4 gap-4 ${screenSharedVideo ? "w-1/5 grid-cols-1" : "grid-cols-4"}`}
          >
            {sharedScreenID !== user?.id && <VideoCall stream={stream} />}
            {Object.values(usersToShow as UserState).map((peer) => (
              <VideoCall stream={peer.stream} />
            ))}
          </div>
          {chat.isChatOpen && (
            <div className="border-l-2 pb-28">
              <Chat />
            </div>
          )}
        </div>
        <div className="fixed bottom-0 p-6 w-full flex justify-center border-t-2">
          <ScreenShareButton onClick={screenShare} />
          <ChatButton onClick={toggleChat} />
        </div>
      </div>
    </>
  );
};

export default RoomDisplay;
