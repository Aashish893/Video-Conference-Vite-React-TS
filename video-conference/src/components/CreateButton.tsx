import { useContext } from "react";
import { RoomContext } from "../ReactContexts/RoomConnectContext";
import { NamesInt } from "../Miscellaneous/UserNames";

export const Create: React.FC = () => {
  const { ws } = useContext(RoomContext);
  const CreateRoom = () => {
    ws.send(JSON.stringify({ type: "createRoom" }));
  };

  return (
    <div className="flex flex-col">
      <NamesInt />
      <button
        onClick={CreateRoom}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Connect to Room
      </button>
    </div>
  );
};
