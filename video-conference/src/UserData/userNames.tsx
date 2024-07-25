import { useContext } from "react";
import { RoomContext } from "../ReactContexts/RoomConnectContext";

export const NameInput: React.FC = ({}) => {
  const { userName, setUserName } = useContext(RoomContext);
  return (
    <div>
      <input
        className="border rounded-md p-2 h-10 my-2 w-full bg-blue-100 focus:bg-blue-200 px-3 py-2"
        placeholder="Enter Your Name"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
      />
    </div>
  );
};
