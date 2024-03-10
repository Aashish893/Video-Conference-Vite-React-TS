import { ws } from "../ws";
export const Create:React.FC = () => {

    const CreateRoom = () => {
        ws.send(JSON.stringify({ type: 'createRoom'}));
    };


    return(
        <button onClick={CreateRoom}>
            Connect to Room
        </button>
    )
}