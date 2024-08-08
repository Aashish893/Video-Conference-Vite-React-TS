import React, { createContext, useEffect, useReducer } from "react";
import { ws } from "../ws";
import { chatReducer, ChatState } from "../Reducers/chatReducer";
import { MessageType } from "../types/chat";
import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from "../Reducers/chatActions";

interface IChat {
  chat: ChatState;
  sendMessage: (message: string, roomId: string, author: string) => void;
  toggleChat: () => void;
}

export const ChatContext = createContext<IChat>({
  chat: {
    messages: [],
    isChatOpen: false,
  },
  sendMessage: (message: string, roomId: string, author: string) => {},
  toggleChat: () => {},
});

interface ChatProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProps> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });

  const handleMessage = (message: any) => {
    if (message.type === "chat-message") {
      chatMessage(message.messageContent);
    }
    if (message.type === "getMessages") {
      addChatHistory(message.chats);
    }
  };

  const sendMessage = (message: string, roomId: string, author: string) => {
    const messageData: MessageType = {
      content: message,
      author,
      timestamp: new Date().getTime(),
    };
    chatDispatch(addMessageAction(messageData));
    ws.send(
      JSON.stringify({
        type: "sendMessage",
        roomID: roomId,
        message: messageData,
      })
    );
  };

  const chatMessage = (message: MessageType) => {
    chatDispatch(addMessageAction(message));
  };

  const addChatHistory = (message: MessageType[]) => {
    chatDispatch(addHistoryAction(message));
  };

  const toggleChat = () => {
    chatDispatch(toggleChatAction(!chat.isChatOpen));
  };

  useEffect(() => {
    const handleWebSocketMessage = (event: any) => {
      const message = JSON.parse(event.data.toString());
      handleMessage(message);
    };
    ws.addEventListener("message", handleWebSocketMessage);

    return () => {
      ws.removeEventListener("message", handleWebSocketMessage);
    };
  });

  return (
    <ChatContext.Provider value={{ chat, sendMessage, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
};
