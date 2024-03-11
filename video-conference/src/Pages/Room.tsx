import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { RoomContext } from "../ReactContexts/RoomConnectContext";

export const Room = () => {
    const {id} = useParams();
    const {ws} = useContext(RoomContext)

    useEffect(() => {
        console.log('navigating to room');
        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({type: 'joinRoom', id: id}));
        });
        
    }, [ws, id]);

    return(
        <>
        RoomId {id}
        </>
    )
}