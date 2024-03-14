"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var Rooms = {};
var roomHandler = function (ws) {
    var createRoom = function () {
        var generatedRoomId = (0, uuid_1.v4)();
        Rooms[generatedRoomId] = [];
        ws.send(JSON.stringify({ type: 'createRoomSuccess', roomID: generatedRoomId }));
        console.log(generatedRoomId, " Room Created");
    };
    var joinRoom = function (_a) {
        var roomId = _a.roomId, userId = _a.userId;
        console.log(roomId, "Joined Room");
        ws.send(JSON.stringify({ type: 'joinRoomSuccess', roomID: roomId }));
    };
    ws.on('message', function (message) {
        var messageData = JSON.parse(message);
        console.log(messageData, " received");
        if (messageData.type === 'createRoom') {
            createRoom();
        }
        else if (messageData.type === 'joinRoom') {
            joinRoom({ roomId: messageData.roomID, userId: messageData.userID });
        }
    });
};
exports.roomHandler = roomHandler;
