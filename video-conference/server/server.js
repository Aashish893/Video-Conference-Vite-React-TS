"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var roomhandler_1 = require("./VIdeoRoom/roomhandler");
var http = require("http");
var express = require("express");
var app = express();
app.get("/health", function (_, res) {
    res.send("Server is running");
});
var port = 8080;
var server = http.createServer(app);
// New Websocket Server.
var wss = new ws_1.WebSocketServer({ server: server });
wss.on('connection', function (ws) {
    console.log('Connection Successful');
    (0, roomhandler_1.roomHandler)(ws);
    ws.on('error', function () {
        console.log('error');
    });
});
server.listen(port, function () {
    console.log("listening on port ".concat(port));
});
