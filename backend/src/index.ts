import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allsocket: User[] = [];

wss.on("connection", (socket: WebSocket) => {
    socket.on("message", (message: string) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "join") {
            allsocket.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
            console.log(`User joined room: ${parsedMessage.payload.roomId}`);
        }

        if (parsedMessage.type === "chat") {
            const currentRoom = allsocket.find((x) => x.socket === socket)?.room;

            allsocket.forEach(s => {
                if (s.room === currentRoom && s.socket !== socket) {  // ✅ Avoid sending to sender
                    s.socket.send(parsedMessage.payload.message);
                }
            });
            socket.send(`You: ${parsedMessage.payload.message}`);
        }
    });
    socket.on("close", () => {
        allsocket = allsocket.filter((s) => s.socket !== socket);
        console.log("User disconnected");
    });
});

console.log("WebSocket server is running on ws://localhost:8080");
