const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', (ws) => {
  console.log('New client connected');
  // Send history
  ws.send(JSON.stringify({ text: 'Welcome to the chat!', timestamp: new Date() }));
  messages.forEach((msg) => ws.send(JSON.stringify(msg)));

  ws.on('message', (message) => {
    const parsed = JSON.parse(message);
    messages.push(parsed);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsed));
      }
    });
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});
