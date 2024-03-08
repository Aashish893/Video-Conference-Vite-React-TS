import {WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';


export const roomHandler = (ws : WebSocket) => {
    
    ws.on('message', (data) => {
        const CreateRoom = () =>{
            const roomId = uuidv4();
            //something-similar to socket.join(roomid)
            ws.send(JSON.stringify({roomcreated:roomId}))
            console.log("Created Room");
        }
        
        const JoinRoom = ({roomId} : {roomId:'strign'}) =>{
            console.log("Joined Room");
        };
        
        const message = JSON.parse(data.toString());
        console.log(message);
        
        if (message.joinroom) {
            console.log("Joining room in handler",message);
            JoinRoom({ roomId: message.joinroom.toString() });
        }else if (message.create){
            console.log("creating room",message);
            CreateRoom();
        }
    })
};