import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../ReactContexts/RoomConnectContext";
import { VideoCall } from "../components/VideoCall";
import { UserState } from "../Reducers/userReducer";
import { ws } from "../ws";
import { ScreenShareButton } from "../components/ScreenShareButton";
import { ChatButton } from "../components/ChatButton";
import { Chat } from "../components/Chat/Chat";
import { NameInput } from "../UserData/userNames";
import { UserContext } from "../ReactContexts/UserContext";
import { ChatContext } from "../ReactContexts/ChatContext";
// import { ChatContext } from "../ReactContexts/ChatContext";

const RoomDisplay: React.FC = () => {
  const { id } = useParams();
  const { stream, allUsers, screenShare, sharedScreenID, setRoomId } =
    useContext(RoomContext);

  const { userName, userId } = useContext(UserContext);
  const { chat, toggleChat } = useContext(ChatContext);
  console.log(chat);
  useEffect(() => {
    setTimeout(() => {
      ws.send(
        JSON.stringify({
          type: "joinRoom",
          roomID: id,
          userID: userId,
          UN: userName,
        })
      );
    }, 1000);
  }, [id, userId, userName, stream]);
  console.log(stream);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);

  const screenSharedVideo =
    sharedScreenID === userId ? stream : allUsers[sharedScreenID]?.stream;

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
            {sharedScreenID !== userId && stream && (
              <div>
                <VideoCall stream={stream} />
                <NameInput />
              </div>
            )}
            {Object.values(usersToShow as UserState)
              .filter((peer) => !!peer.stream)
              .map((peer) => (
                <div key={peer.userId}>
                  <VideoCall stream={peer.stream} />
                  <div>{peer.userName}</div>
                </div>
              ))}
          </div>
          {chat.isChatOpen && (
            <div className="border-l-2 pb-28">
              <Chat />
            </div>
          )}
        </div>
        <div className="fixed bottom-0 p-6 w-full flex justify-center border-t-2 space-x-4">
          <ScreenShareButton onClick={screenShare} />
          <ChatButton onClick={toggleChat} />
        </div>
      </div>
    </>
  );
};

export default RoomDisplay;
