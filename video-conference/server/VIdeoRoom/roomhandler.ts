import {WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';

const Rooms : Record<string, string []> = {}

interface RoomProps {
    roomId : string;
    userId : string; 
}

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const generatedRoomId = uuidv4();
        Rooms[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID : generatedRoomId }));
        console.log(generatedRoomId ,  " Room Created");
    };

    const joinRoom = ({roomId, userId} :RoomProps) => {
        if(Rooms[roomId]){
            Rooms[roomId].push(userId);
            ws.send(JSON.stringify({ type: 'joinRoomSuccess', roomID : roomId }));
            ws.send(JSON.stringify({ type: 'getUsers', roomID : roomId , participants :Rooms[roomId] }));
            console.log(Rooms);            
        }
    };

    ws.on('message', (message : string) => {
        const messageData = JSON.parse(message);
        console.log(messageData , " received");

        if (messageData.type ==='createRoom'){
            createRoom();
        }
        else if (messageData.type === 'joinRoom'){
            joinRoom({roomId : messageData.roomID , userId : messageData.userID});
        }

    })
}