"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 6969 });
wss.on('connection', (ws) => {
    ws.on('error', (err) => {
        console.log("erro");
    });
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            client.send(message);
        });
    });
    console.log("hello ");
});
