"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var Rooms = {};
var connectionMap = {};
var serverId = '';
var roomHandler = function (ws) {
    var createRoom = function () {
        var generatedRoomId = (0, uuid_1.v4)();
        Rooms[generatedRoomId] = [];
        connectionMap[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID: generatedRoomId }));
    };
    var joinRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        if (Rooms[roomId]) {
            if (!Rooms[roomId].includes(userId)) {
                Rooms[roomId].push(userId);
                connectionMap[roomId].push({ ws: ws, userId: userId });
                // Broadcast to all ws.send(JSON.stringify({ type: 'userJoined', roomID : roomId, userID : userId })); 
                broadcast(roomId, { type: 'userJoined', roomID: roomId, userID: userId }, userId);
                ws.send(JSON.stringify({ type: 'getUsers', roomID: roomId, participants: Rooms[roomId] }));
            }
        }
        ws.on('close', function () {
            leftRoom({ roomId: roomId, userId: userId });
        });
    };
    var leftRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        Rooms[roomId] = Rooms[roomId].filter(function (id) { return id !== userId; });
        broadcast(roomId, { type: 'userLeft', roomID: roomId, userID: userId }, userId);
    };
    var startSharing = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        broadcast(roomId, { type: 'user-started-sharing', userID: userId }, userId);
    };
    var stopSharing = function (roomId, userId) {
        broadcast(roomId, { type: 'user-stopped-sharing' }, userId);
    };
    var addMessage = function (roomId, message, userId) {
        broadcast(roomId, { type: "chat-message", messageContent: message }, userId);
        console.log(connectionMap);
    };
    var broadcast = function (roomId, message, userId) {
        if (connectionMap[roomId]) {
            connectionMap[roomId].forEach(function (client) {
                if (client.userId !== userId) {
                    client.ws.send(JSON.stringify(message));
                }
            });
        }
    };
    ws.on('message', function (message) {
        var messageData = JSON.parse(message);
        if (messageData.type === 'createRoom') {
            createRoom();
        }
        else if (messageData.type === 'joinRoom') {
            joinRoom({ roomId: messageData.roomID, userId: messageData.userID });
        }
        else if (messageData.type === 'startSharing') {
            startSharing({ roomId: messageData.roomID, userId: messageData.userID });
        }
        else if (messageData.type === 'stopSharing') {
            stopSharing(messageData.roomID, messageData.userId);
        }
        else if (messageData.type === 'sendMessage') {
            addMessage(messageData.roomID, messageData.message, messageData.message.author);
            console.log(messageData.message.author, " Sender");
        }
    });
};
exports.roomHandler = roomHandler;
