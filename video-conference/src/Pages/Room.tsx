import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { roomContext } from "../ReactContexts/RoomConnectContext";

export const Room = () => {

    const {id} = useParams();
    const {ws} = useContext(roomContext);
    
    useEffect(() => {
        ws.send(JSON.stringify({joinroom:id}))
    },[id]);

    return(
        <>
        RoomId {id}
        </>
    )
}