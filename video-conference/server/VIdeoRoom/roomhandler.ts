import {WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const generatedRoomId = uuidv4();
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID : generatedRoomId }));
        console.log(generatedRoomId ,  " Room Created");
    };

    const joinRoom = ({roomId} :{roomId : string}) => {
        console.log(roomId, "Joined Room");
        ws.send(JSON.stringify({ type: 'joinRoomSuccess', roomID : roomId }));
        
    };

    ws.on('message', (message : string) => {
        const messageData = JSON.parse(message);
        console.log(messageData , " received");

        if (messageData.type ==='createRoom'){
            createRoom();
        }
        else if (messageData.type === 'joinRoom'){
            joinRoom({roomId : messageData.roomID});
        }

    })
}