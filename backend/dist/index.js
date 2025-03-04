"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allsocket = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allsocket.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
            console.log(`User joined room: ${parsedMessage.payload.roomId}`);
        }
        if (parsedMessage.type === "chat") {
            const currentRoom = (_a = allsocket.find((x) => x.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            allsocket.forEach(s => {
                if (s.room === currentRoom && s.socket !== socket) { // ✅ Avoid sending to sender
                    s.socket.send(parsedMessage.payload.message);
                }
            });
            // ✅ Send acknowledgment message to the sender
            socket.send(`You: ${parsedMessage.payload.message}`);
        }
    });
    // Handle disconnection
    socket.on("close", () => {
        allsocket = allsocket.filter((s) => s.socket !== socket);
        console.log("User disconnected");
    });
});
console.log("WebSocket server is running on ws://localhost:8080");
