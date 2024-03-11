import { useParams } from "react-router-dom"
import { ws } from "../ws";

export const Room = () => {
    const {id} = useParams();
    ws.send(JSON.stringify({ type: 'joinRoom', id:id }))
    console.log("naigated to room");
    // useEffect(() => {
    //     
    //     console.log("executed");
    // },[id]);

    return(
        <>
        RoomId {id}
        </>
    )
}