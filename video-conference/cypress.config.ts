import { defineConfig } from "cypress";
import WebSocket from "ws";
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      let ws;
      on('task',{
        connect(){
          ws = new WebSocket('ws://localhost:8080'); // Server-side WebSocket connection
          console.log('Connected to WebSocket server');
          return null;
        },
        
        joinRoom(data) {
          console.log('joinRoom task called with data:', data);
        
          const { roomId, userId, userName } = data;
        
          if (!roomId) {
            console.log('No room ID provided or invalid data:', data);
            return null;
          }

        
          if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log('WebSocket is not open or not initialized');
            return null;
          }
        
          ws.send(
            JSON.stringify({
              type: "joinRoom",
              roomID: roomId,
              userID: userId,
              UN: userName,
            })
          );
        
          console.log('WebSocket message sent successfully');
        
          return null;
        },

        chat(data) {
          const { event, roomId, userId, userName, eventData } = data;
          console.log('chat task called with data:', data);

          let message = {};

          switch (event) {
            case 'send-message':
              message = {
                type: "sendMessage",
                roomID: roomId,
                message: eventData,
              };
              break;

            case 'startSharing':
              message = {
                type: "startSharing",
                userID: userId,
                roomID: roomId,
              };
              break;

            case 'stopSharing':
              message = {
                type: "stopSharing",
                userID: userId,
                roomID: roomId,
              };
              break;

            case 'userChangedName':
              message = {
                type: "userChangedName",
                userId: userId,
                userName: userName,
                roomId: roomId,
              };
              break;

            case 'createRoom':
              message = {
                type: "createRoom",
              };
              break;

            // Add other cases as needed

            default:
              console.log('Unknown event type:', event);
              return null;
          }

          ws.send(JSON.stringify(message));
          console.log(`WebSocket ${event} message sent:`, message);
          return null;
        }

      });
    },
  },
});
