import {WebSocket} from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface RoomProps {
    roomId : string;
    userId : string; 
}

interface UserProps extends RoomProps{
    userName : string;
}

interface MessageType {
    content : string;
    author : string;
    timestamp : number;
}

interface User{
    userId : string;
    userName : string,
}

const Rooms : Record<string, Record<string, User>> = {}
const Chats : Record<string, MessageType []> = {}
const SharingScreen : Record<string, string> = {}

interface WebSocketMap {
    [roomId: string]: { ws: WebSocket, userId: string }[];
}

const connectionMap : WebSocketMap = {}; 

export const roomHandler = (ws:WebSocket) => {
    const createRoom = () =>{
        const generatedRoomId = uuidv4();
        Rooms[generatedRoomId] = {};
        connectionMap[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID : generatedRoomId }));
    };

    const joinRoom = ({ roomId, userId, userName }: UserProps) => {
        console.log(`Cypress is trying to access roomId: ${roomId}`);
    
        if (!Rooms[roomId]) Rooms[roomId] = {};
        if (!Chats[roomId]) Chats[roomId] = [];
        
        // Initialize connectionMap[roomId] if it doesn't exist
        if (!connectionMap[roomId]) connectionMap[roomId] = [];
        
        Rooms[roomId][userId] = { userId, userName };
        
        const userAlreadyInRoom = connectionMap[roomId].some(client => client.userId === userId);
    
        if (!userAlreadyInRoom) {
            connectionMap[roomId].push({ ws, userId });
        }
    
        ws.send(JSON.stringify({ type: 'getUsers', roomID: roomId, participants: Rooms[roomId] }));
        broadcast(roomId, { type: 'userJoined', roomID: roomId, userID: userId, UN: userName }, userId);
        ws.send(JSON.stringify({ type: 'getMessages', chats: Chats[roomId], roomID: roomId, participants: Rooms[roomId] }));
    
        if (SharingScreen[roomId]) {
            ws.send(JSON.stringify({ type: 'user-started-sharing', userID: SharingScreen[roomId] }));
        }
    
        ws.on('close', () => {
            leftRoom({ roomId, userId });
        });
    };

    const leftRoom = ({roomId, userId} : RoomProps) => {
        // Remove user from connectionMap
        if (connectionMap[roomId]) {
            connectionMap[roomId] = connectionMap[roomId].filter(client => client.userId !== userId);
        }
        if (SharingScreen[roomId] === userId) {
            delete SharingScreen[roomId];
            broadcast(roomId, { type: 'user-stopped-sharing', userID: userId }, userId);
        }
        // Broadcast userLeft event
        broadcast(roomId, { type: 'userLeft', roomID: roomId, userID: userId }, userId);

        // Update remaining users
        broadcast(roomId, { type: 'getUsers', roomID: roomId, participants: Rooms[roomId] }, userId);
        
    }

    const startSharing = ({roomId,userId}: RoomProps) =>{
        SharingScreen[roomId] = userId;
        broadcast(roomId,{type : 'user-started-sharing',userID : userId}, userId);
    }

    const stopSharing = (roomId : string, userId : string) =>{
        delete SharingScreen[roomId];
        broadcast(roomId,{type : 'user-stopped-sharing'}, userId);
    }

    const addMessage = (roomId : string, message : MessageType, userId : string) => {
        if(Chats[roomId]){
            Chats[roomId].push(message);
        }else{
            Chats[roomId] = []
            Chats[roomId].push(message);
        }
        console.log(Chats);
        console.log(userId);
        broadcast(roomId,{type: "chat-message", messageContent : message}, userId);
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

    const sendToSpecificUser = (roomId: string, userId: string, message: any) =>{
        const userConnection = connectionMap[roomId].find(client => client.userId === userId);
        if (userConnection){
            userConnection.ws.send(JSON.stringify(message))
        }
    }

    const changeName = ({userId,userName, roomId} : {userId : string, userName : string, roomId : string}) => {
        if (Rooms[roomId] && Rooms[roomId][userId]) {
            Rooms[roomId][userId].userName = userName;
            broadcast(roomId, { type: "name-changed", messageContent: { userId, userName } }, userId);
        } else {
            console.error(`Cannot change name. User ${userId} not found in room ${roomId}.`);
        }
    }
    ws.on('message', (message : string) => {
        const messageData = JSON.parse(message);
        if (messageData.type ==='createRoom'){
            createRoom();
        }
        else if (messageData.type === 'joinRoom'){
            joinRoom({roomId : messageData.roomID , userId : messageData.userID, userName : messageData.UN});
        }

        else if (messageData.type === 'startSharing'){
            startSharing({roomId:messageData.roomID,userId:messageData.userID});
        }
        else if (messageData.type === 'stopSharing'){
            stopSharing(messageData.roomID, messageData.userId);
        }
        else if (messageData.type === 'sendMessage'){
            addMessage(messageData.roomID,messageData.message, messageData.message.author);
        }
        else if (messageData.type === 'userChangedName'){
            changeName({userId : messageData.userId, userName : messageData.userName, roomId : messageData.roomId});
        }
    })
}