"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var roomHandler = function (ws) {
    ws.on('message', function (data) {
        var CreateRoom = function () {
            var roomId = (0, uuid_1.v4)();
            //something-similar to socket.join(roomid)
            ws.send(JSON.stringify({ roomcreated: roomId }));
            console.log("Created Room");
        };
        var JoinRoom = function (_a) {
            var roomId = _a.roomId;
            console.log("Joined Room");
        };
        var message = JSON.parse(data.toString());
        console.log(message);
        if (message.joinroom) {
            console.log("Joining room in handler", message);
            JoinRoom({ roomId: message.joinroom.toString() });
        }
        else if (message.create) {
            console.log("creating room", message);
            CreateRoom();
        }
    });
};
exports.roomHandler = roomHandler;
