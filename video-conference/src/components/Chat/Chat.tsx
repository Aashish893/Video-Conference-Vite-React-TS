import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { MessageType } from "../../types/chat";
import { useContext } from "react";
import { ChatContext } from "../../ReactContexts/ChatContext";

export const Chat: React.FC = () => {
  const { chat } = useContext(ChatContext);
  console.log(chat);
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {chat.messages.map((message: MessageType) => (
          <ChatBubble
            message={message}
            key={message.timestamp + message?.author || "anon"}
          />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};
