import {WebSocket} from 'ws';
import { v4 as uuidv4 } from 'uuid';

const Rooms : Record<string, string []> = {}

interface WebSocketMap {
    [roomId: string]: WebSocket[];
}

const connectionMap : WebSocketMap = {}; 

interface RoomProps {
    roomId : string;
    userId : string; 
}

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const generatedRoomId = uuidv4();
        Rooms[generatedRoomId] = [];
        connectionMap[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID : generatedRoomId }));
        console.log(generatedRoomId ,  " Room Created");
    };

    const joinRoom = ({roomId, userId} :RoomProps) => {
        if(Rooms[roomId]){
            Rooms[roomId].push(userId);
            connectionMap[roomId].push(ws);
            // Broadcast to all ws.send(JSON.stringify({ type: 'userJoined', roomID : roomId, userID : userId })); 
            broadcast(roomId,{type : 'userJoined', roomID : roomId, userID : userId});
            ws.send(JSON.stringify({ type: 'getUsers', roomID : roomId , participants :Rooms[roomId] }));
            console.log(Rooms);            
        }
        ws.on('close', () =>{
            console.log("User Left The Room", userId);
            leftRoom({roomId, userId});
        })
    };

    const leftRoom = ({roomId, userId} : RoomProps) => {
        Rooms[roomId] = Rooms[roomId].filter(id => id !== userId);
        broadcast(roomId, {type:'userLeft',roomID : roomId ,userID : userId})
        console.log(Rooms, " After delete");
    }

    const startSharing = ({roomId,userId}: RoomProps) =>{
        broadcast(roomId,{type : 'user-started-sharing',userID : userId});
        console.log("sharing screen Id");
    }

    const stopSharing = (roomId : string) =>{
        broadcast(roomId,{type : 'user-stopped-sharing'});
        console.log("stopeed sharing screen");
    }

    const broadcast = (roomId : string, message : any) => {
        console.log("Broadcasting");
        if(connectionMap[roomId]){
            connectionMap[roomId].forEach(client => {
                client.send(JSON.stringify(message));
            })        
        }
    }

    ws.on('message', (message : string) => {
        const messageData = JSON.parse(message);
        if (messageData.type ==='createRoom'){
            createRoom();
        }
        else if (messageData.type === 'joinRoom'){
            joinRoom({roomId : messageData.roomID , userId : messageData.userID});
        }

        else if (messageData.type === 'startSharing'){
            startSharing({roomId:messageData.roomID,userId:messageData.userID});
        }
        else if (messageData.type === 'stopSharing'){
            stopSharing(messageData.roomID);
        }
    })
}