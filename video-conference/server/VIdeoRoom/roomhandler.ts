import {WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';

type Room = {
    roomId: string;
    clients: Set<WebSocket>;
    
  };
  
const rooms: Map<string, Room> = new Map();

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const generatedRoomId = uuidv4();
        rooms.set(generatedRoomId, { roomId: generatedRoomId, clients: new Set() });
        console.log(rooms);
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID : generatedRoomId }));
        console.log(generatedRoomId ,  " Room Created");
    };

    const joinRoom = (roomId : string) => {
        if (!rooms.has(roomId)){
            ws.send(JSON.stringify({ type: 'joinRoomError', message: 'Room does not exist' }));
            return;
        }
        rooms.get(roomId)!.clients.add(ws);
        ws.send(JSON.stringify({ type: 'joinRoomSuccess', roomID : roomId }));
        console.log(roomId, "Joined Room");
    };

    ws.on('message', (message : string) => {
        const messageData = JSON.parse(message);
        console.log(messageData , " received");

        if (messageData.type ==='createRoom'){
            createRoom();
        }
        else if (messageData.type === 'joinRoom'){
            joinRoom(messageData.roomID);
        }

    })
}