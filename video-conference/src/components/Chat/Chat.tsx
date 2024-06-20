import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { MessageType } from "../../types/chat";
import { useContext } from "react";
import { RoomContext } from "../../ReactContexts/RoomConnectContext";

export const Chat: React.FC = ({}) => {
  const { chat } = useContext(RoomContext);
  console.log(chat, " FROM CHAT.TSX");
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {chat.messages.map((message: MessageType) => (
          <ChatBubble message={message} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};
