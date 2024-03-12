import {WebSocketServer} from 'ws';
import { roomHandler } from './VIdeoRoom/roomhandler';
import * as http from 'http';
import * as express from 'express';

const app = express();
app.get("/health", (_, res) => {
    res.send("Server is running");
});


const port = process.env.PORT || 8080;
const server = http.createServer(app);

// New Websocket Server.
const wss = new WebSocketServer({server});


wss.on('connection', (ws) =>  {

    console.log('Connection Successful');

    roomHandler(ws);
    ws.on('error', () =>{
        console.log('error');
    });    

});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
