import { useContext } from "react";
import { MessageType } from "../../types/chat";
import { RoomContext } from "../../ReactContexts/RoomConnectContext";
import classNames from "classnames";
export const ChatBubble: React.FC<{ message: MessageType }> = ({ message }) => {
  const { user } = useContext(RoomContext);
  const isSelf = message.author === user?.id || user?._lastServerId;

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
      <div
        className={classNames("inline-block py-2 px-4 rounded", {
          "bg-red-200": isSelf,
          "bg-red-300": !isSelf,
        })}
      >
        {message.content}
      </div>
    </div>
  );
};
