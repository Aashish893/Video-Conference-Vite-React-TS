"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var Rooms = {};
var Chats = {};
var SharingScreen = {};
var connectionMap = {};
var roomHandler = function (ws) {
    var createRoom = function () {
        var generatedRoomId = (0, uuid_1.v4)();
        Rooms[generatedRoomId] = {};
        connectionMap[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID: generatedRoomId }));
    };
    var joinRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId, userName = _a.userName;
        console.log("Cypress is trying to access roomId: ".concat(roomId));
        if (!Rooms[roomId])
            Rooms[roomId] = {};
        if (!Chats[roomId])
            Chats[roomId] = [];
        // Initialize connectionMap[roomId] if it doesn't exist
        if (!connectionMap[roomId])
            connectionMap[roomId] = [];
        Rooms[roomId][userId] = { userId: userId, userName: userName };
        var userAlreadyInRoom = connectionMap[roomId].some(function (client) { return client.userId === userId; });
        if (!userAlreadyInRoom) {
            connectionMap[roomId].push({ ws: ws, userId: userId });
        }
        ws.send(JSON.stringify({ type: 'getUsers', roomID: roomId, participants: Rooms[roomId] }));
        broadcast(roomId, { type: 'userJoined', roomID: roomId, userID: userId, UN: userName }, userId);
        ws.send(JSON.stringify({ type: 'getMessages', chats: Chats[roomId], roomID: roomId, participants: Rooms[roomId] }));
        if (SharingScreen[roomId]) {
            ws.send(JSON.stringify({ type: 'user-started-sharing', userID: SharingScreen[roomId] }));
        }
        ws.on('close', function () {
            leftRoom({ roomId: roomId, userId: userId });
        });
    };
    var leftRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        // Remove user from connectionMap
        if (connectionMap[roomId]) {
            connectionMap[roomId] = connectionMap[roomId].filter(function (client) { return client.userId !== userId; });
        }
        if (SharingScreen[roomId] === userId) {
            delete SharingScreen[roomId];
            broadcast(roomId, { type: 'user-stopped-sharing', userID: userId }, userId);
        }
        // Broadcast userLeft event
        broadcast(roomId, { type: 'userLeft', roomID: roomId, userID: userId }, userId);
        // Update remaining users
        broadcast(roomId, { type: 'getUsers', roomID: roomId, participants: Rooms[roomId] }, userId);
    };
    var startSharing = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        SharingScreen[roomId] = userId;
        broadcast(roomId, { type: 'user-started-sharing', userID: userId }, userId);
    };
    var stopSharing = function (roomId, userId) {
        delete SharingScreen[roomId];
        broadcast(roomId, { type: 'user-stopped-sharing' }, userId);
    };
    var addMessage = function (roomId, message, userId) {
        if (Chats[roomId]) {
            Chats[roomId].push(message);
        }
        else {
            Chats[roomId] = [];
            Chats[roomId].push(message);
        }
        console.log(Chats);
        console.log(userId);
        broadcast(roomId, { type: "chat-message", messageContent: message }, userId);
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
    var sendToSpecificUser = function (roomId, userId, message) {
        var userConnection = connectionMap[roomId].find(function (client) { return client.userId === userId; });
        if (userConnection) {
            userConnection.ws.send(JSON.stringify(message));
        }
    };
    var changeName = function (_a) {
        var userId = _a.userId, userName = _a.userName, roomId = _a.roomId;
        if (Rooms[roomId] && Rooms[roomId][userId]) {
            Rooms[roomId][userId].userName = userName;
            broadcast(roomId, { type: "name-changed", messageContent: { userId: userId, userName: userName } }, userId);
        }
        else {
            console.error("Cannot change name. User ".concat(userId, " not found in room ").concat(roomId, "."));
        }
    };
    ws.on('message', function (message) {
        var messageData = JSON.parse(message);
        if (messageData.type === 'createRoom') {
            createRoom();
        }
        else if (messageData.type === 'joinRoom') {
            joinRoom({ roomId: messageData.roomID, userId: messageData.userID, userName: messageData.UN });
        }
        else if (messageData.type === 'startSharing') {
            startSharing({ roomId: messageData.roomID, userId: messageData.userID });
        }
        else if (messageData.type === 'stopSharing') {
            stopSharing(messageData.roomID, messageData.userId);
        }
        else if (messageData.type === 'sendMessage') {
            addMessage(messageData.roomID, messageData.message, messageData.message.author);
        }
        else if (messageData.type === 'userChangedName') {
            changeName({ userId: messageData.userId, userName: messageData.userName, roomId: messageData.roomId });
        }
    });
};
exports.roomHandler = roomHandler;
