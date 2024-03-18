"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var Rooms = {};
var connectionMap = {};
var roomHandler = function (ws) {
    var createRoom = function () {
        var generatedRoomId = (0, uuid_1.v4)();
        Rooms[generatedRoomId] = [];
        connectionMap[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID: generatedRoomId }));
        console.log(generatedRoomId, " Room Created");
    };
    var joinRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        if (Rooms[roomId]) {
            Rooms[roomId].push(userId);
            connectionMap[roomId].push(ws);
            // Broadcast to all ws.send(JSON.stringify({ type: 'userJoined', roomID : roomId, userID : userId })); 
            broadcast(roomId, { type: 'userJoined', roomID: roomId, userID: userId });
            ws.send(JSON.stringify({ type: 'getUsers', roomID: roomId, participants: Rooms[roomId] }));
            console.log(Rooms);
        }
        ws.on('close', function () {
            console.log("User Left The Room", userId);
            leftRoom({ roomId: roomId, userId: userId });
        });
    };
    var leftRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        Rooms[roomId] = Rooms[roomId].filter(function (id) { return id !== userId; });
        broadcast(roomId, { type: 'userLeft', roomID: roomId, userID: userId });
        console.log(Rooms, " After delete");
    };
    var broadcast = function (roomId, message) {
        console.log("Broadcasting");
        connectionMap[roomId].forEach(function (client) {
            client.send(JSON.stringify(message));
            console.log("Broadcast sent");
        });
    };
    ws.on('message', function (message) {
        var messageData = JSON.parse(message);
        if (messageData.type === 'createRoom') {
            createRoom();
        }
        else if (messageData.type === 'joinRoom') {
            joinRoom({ roomId: messageData.roomID, userId: messageData.userID });
        }
    });
};
exports.roomHandler = roomHandler;
