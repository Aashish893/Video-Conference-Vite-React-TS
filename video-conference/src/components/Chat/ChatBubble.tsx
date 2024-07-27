import { useContext } from "react";
import { MessageType } from "../../types/chat";
import { RoomContext } from "../../ReactContexts/RoomConnectContext";
import classNames from "classnames";
import { UserContext } from "../../ReactContexts/UserContext";
export const ChatBubble: React.FC<{ message: MessageType }> = ({ message }) => {
  const { allUsers } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  console.log(allUsers);
  const author = message.author && allUsers[message.author].userName;
  const userName = author || "Anonnymous";
  const isSelf = message.author === userId;
  const time = new Date(message.timestamp).toLocaleTimeString();
  if (!message || !message.author) {
    return null; // or return some fallback UI
  }

  return (
    <div
      className={classNames("m-2 flex", {
        "pl-10 justify-end": isSelf,
        "pr-10 justify-start": !isSelf,
      })}
    >
      <div className="flex flex-col">
        <div
          className={classNames("inline-block py-2 px-4 rounded", {
            "bg-red-200": isSelf,
            "bg-red-300": !isSelf,
          })}
        >
          {message.content}
        </div>
        <div
          className={classNames("text-xs opacity-50", {
            "text-right": isSelf,
            "text-left": !isSelf,
          })}
        >
          {time}
        </div>
        <div
          className={classNames("text-s", {
            "text-right": isSelf,
            "text-left": !isSelf,
          })}
        >
          {isSelf ? "You" : userName}
        </div>
      </div>
    </div>
  );
};
