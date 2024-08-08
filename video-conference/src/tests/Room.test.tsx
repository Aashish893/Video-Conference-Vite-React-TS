import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import RoomDisplay from "../Pages/Room";
import { ChatProvider } from "../ReactContexts/ChatContext";
import { RoomContext } from "../ReactContexts/RoomConnectContext";

test("Chat Button toggle chat", () => {
  render(
    <ChatProvider>
      <RoomDisplay />
    </ChatProvider>
  );
  const chatButton = screen.getByTestId("chat-button");
  fireEvent(
    chatButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  const chatInput = screen.getByRole("textbox");
  expect(chatInput).toBeInTheDocument();
});

const customRender = (ui: any, providerProps = {}) => {
  const defaultProps = {
    value: {
      allUsers: {
        ash: {
          stream: {} as MediaStream,
          userName: "",
          peerId: "ash1",
        },
        newUser: {
          stream: {} as MediaStream,
          userName: "",
          peerId: "new2",
        },
        aashish: {
          stream: {} as MediaStream,
          userName: "",
          peerId: "aashish23",
        },
      },
      screenShare: () => {},
      sharedScreenID: "",
      setRoomId: (id: string) => {},
      roomId: "room1",
    },
  };

  const props = { ...defaultProps, ...providerProps };

  return render(<RoomContext.Provider {...props}>{ui}</RoomContext.Provider>);
};

test("test video render for every user", () => {
  customRender(<RoomDisplay />, {});
  const videos = screen.getAllByTestId("user-video");
  expect(videos).toHaveLength(3);
});
