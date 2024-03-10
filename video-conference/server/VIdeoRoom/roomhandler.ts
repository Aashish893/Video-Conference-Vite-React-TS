import {WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';

type Room = {
    id: string;
    clients: Set<WebSocket>;
  };
  
const rooms: Map<string, Room> = new Map();

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const roomId = uuidv4();
        rooms.set(roomId, { id: roomId, clients: new Set() });
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomId }));
        console.log(roomId ,  " Room Created");
    };

    const joinRoom = (roomId : string) => {
        if (!rooms.has(roomId)){
            ws.send(JSON.stringify({ type: 'joinRoomError', message: 'Room does not exist' }));
            return;
        }
        rooms.get(roomId)!.clients.add(ws);
        ws.send(JSON.stringify({ type: 'joinRoomSuccess', roomId }));
        console.log(roomId, "Joined Room");
    };

    ws.on('message', (message : string) => {
        const messageData = JSON.parse(message);
        console.log(messageData);

        if (messageData.type ==='createRoom'){
            createRoom();
        }
        else if (messageData.type === 'joinRoom'){
            joinRoom(messageData);
        }

    })
}