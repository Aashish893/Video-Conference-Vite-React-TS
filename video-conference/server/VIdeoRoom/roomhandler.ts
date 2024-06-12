import {WebSocket} from 'ws';
import { v4 as uuidv4 } from 'uuid';


const Rooms : Record<string, string []> = {}

interface WebSocketMap {
    [roomId: string]: { ws: WebSocket, userId: string }[];
}

const connectionMap : WebSocketMap = {}; 

let serverId = '';

interface RoomProps {
    roomId : string;
    userId : string; 
}

interface MessageType {
    content : string;
    author : string;
    timestamp : number;
}

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const generatedRoomId = uuidv4();
        Rooms[generatedRoomId] = [];
        connectionMap[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID : generatedRoomId }));
    };

    const joinRoom = ({roomId, userId} :RoomProps) => {
        if(Rooms[roomId] ){
            if (!Rooms[roomId].includes(userId)){
                Rooms[roomId].push(userId);
                connectionMap[roomId].push({ws, userId});
                // Broadcast to all ws.send(JSON.stringify({ type: 'userJoined', roomID : roomId, userID : userId })); 
                broadcast(roomId,{type : 'userJoined', roomID : roomId, userID : userId}, userId);
                ws.send(JSON.stringify({ type: 'getUsers', roomID : roomId , participants :Rooms[roomId] }));
            }               
        }
        ws.on('close', () =>{
            leftRoom({roomId, userId});
        })
    };

    const leftRoom = ({roomId, userId} : RoomProps) => {
        Rooms[roomId] = Rooms[roomId].filter(id => id !== userId);
        broadcast(roomId, {type:'userLeft',roomID : roomId ,userID : userId}, userId)
    }

    const startSharing = ({roomId,userId}: RoomProps) =>{
        broadcast(roomId,{type : 'user-started-sharing',userID : userId}, userId);
    }

    const stopSharing = (roomId : string, userId : string) =>{
        broadcast(roomId,{type : 'user-stopped-sharing'}, userId);
    }

    const addMessage = (roomId : string, message : MessageType, userId : string) => {
        broadcast(roomId,{type: "chat-message", messageContent : message}, userId);
        console.log(connectionMap);
    }
    const broadcast = (roomId : string, message : any, userId : string) => {
        if(connectionMap[roomId]){
            connectionMap[roomId].forEach(client => {
                if(client.userId !== userId)
                    {
                        client.ws.send(JSON.stringify(message));
                }
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
            stopSharing(messageData.roomID, messageData.userId);
        }
        else if (messageData.type === 'sendMessage'){
            addMessage(messageData.roomID,messageData.message, messageData.message.author);
            console.log(messageData.message.author, " Sender");
        }
    })
}