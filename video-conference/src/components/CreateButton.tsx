import { useContext } from "react"
import { roomContext } from "../ReactContexts/RoomConnectContext"

export const Create:React.FC = () => {

    const {ws} = useContext(roomContext);

    const CreateRoom = () => {
        ws.send(JSON.stringify({create:"room"}));
    };
    return(
        <button onClick={CreateRoom}>
            Connect to Room
        </button>
    )
}