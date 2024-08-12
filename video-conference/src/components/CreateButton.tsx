import { ws } from "../ws";
import { NameInput } from "../UserData/userNames";
import { Buttons } from "./general/Buttons";

export const Create: React.FC = () => {
  const CreateRoom = () => {
    setTimeout(() => {
      ws.send(JSON.stringify({ type: "createRoom" }));
    }, 200);

    // ws.send(JSON.stringify({ type: "createRoom" }));
  };

  return (
    <div>
      <NameInput />
      <Buttons onClick={CreateRoom} className="px-4 py-4 text-xl">
        Connect to Room
      </Buttons>
    </div>
  );
};
