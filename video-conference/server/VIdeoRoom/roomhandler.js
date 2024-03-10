"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var rooms = new Map();
var roomHandler = function (ws) {
    var createRoom = function () {
        var roomId = (0, uuid_1.v4)();
        rooms.set(roomId, { id: roomId, clients: new Set() });
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomId: roomId }));
        console.log(roomId, " Room Created");
    };
    var joinRoom = function (roomId) {
        if (!rooms.has(roomId)) {
            ws.send(JSON.stringify({ type: 'joinRoomError', message: 'Room does not exist' }));
            return;
        }
        rooms.get(roomId).clients.add(ws);
        ws.send(JSON.stringify({ type: 'joinRoomSuccess', roomId: roomId }));
        console.log(roomId, "Joined Room");
    };
    ws.on('message', function (message) {
        var messageData = JSON.parse(message);
        console.log(messageData);
        if (messageData.type === 'createRoom') {
            createRoom();
        }
        else if (messageData.type === 'joinRoom') {
            joinRoom(messageData);
        }
    });
};
exports.roomHandler = roomHandler;
