import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import {WebSocketServer} from 'ws';
import { roomHandler } from './VIdeoRoom/roomhandler';

const http = require('http');

const express = require('express');

const app = express();

const port = process.env.PORT || 8080;
const server = http.createServer(app);

function onSocketPreError(e: Error) {
    console.log(e);
}

function onSocketPostError(e: Error) {
    console.log(e);
}


// New Websocket Server.
const wss = new WebSocketServer({server});

// Handling Connections to server
const s = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

s.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    socket.on('error', onSocketPreError);

    // perform auth
    if (!!req.headers['BadAuth']) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        socket.removeListener('error', onSocketPreError);
        wss.emit('connection', ws, req);
    });
});

wss.on('connection', (ws) =>  {
    roomHandler(ws);
    ws.on('error', onSocketPostError);    
    console.log('Connection Successful');

    ws.on('close', () => {
        console.log('Client disconnected');
    });

})

console.log('Signaling server is running on port 8080');