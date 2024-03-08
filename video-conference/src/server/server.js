"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var roomhandler_1 = require("./VIdeoRoom/roomhandler");
var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var server = http.createServer(app);
function onSocketPreError(e) {
    console.log(e);
}
function onSocketPostError(e) {
    console.log(e);
}
// New Websocket Server.
var wss = new ws_1.WebSocketServer({ server: server });
// Handling Connections to server
var s = app.listen(port, function () {
    console.log("Listening on port ".concat(port));
});
s.on('upgrade', function (req, socket, head) {
    socket.on('error', onSocketPreError);
    // perform auth
    if (!!req.headers['BadAuth']) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
    wss.handleUpgrade(req, socket, head, function (ws) {
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    });
});
wss.on('connection', function (ws) {
    (0, roomhandler_1.roomHandler)(ws);
    ws.on('error', onSocketPostError);
    console.log('Connection Successful');
    ws.on('close', function () {
        console.log('Client disconnected');
    });
});
console.log('Signaling server is running on port 8080');
