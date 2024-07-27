import { useContext, useState } from "react";
import { Buttons } from "../general/Buttons";
import { RoomContext } from "../../ReactContexts/RoomConnectContext";
import { UserContext } from "../../ReactContexts/UserContext";
import { ChatContext } from "../../ReactContexts/ChatContext";

export const ChatInput: React.FC = ({}) => {
  const [message, setMessage] = useState("");
  const { roomId } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  console.log(userId);
  const { sendMessage } = useContext(ChatContext);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message, roomId, userId);
          setMessage("");
        }}
      >
        <div className="flex">
          <textarea
            className="border rounded bg-blue-100 focus:bg-blue-200 px-3 py-2 outline-none"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Buttons type="submit" className="py-2 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Buttons>
        </div>
      </form>
    </div>
  );
};
