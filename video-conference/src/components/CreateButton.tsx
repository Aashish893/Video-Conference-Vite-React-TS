import { useContext } from "react";
import { RoomContext } from "../ReactContexts/RoomConnectContext";

export const Create:React.FC = () => {
    const {ws} = useContext(RoomContext) 
    const CreateRoom = () => {
        console.log(ws);
        ws.send(JSON.stringify({ type: 'createRoom'}));
    };

    return(
        <button onClick={CreateRoom}>
            Connect to Room
        </button>
    )
}