import { useEffect, useState, useRef } from "react";

const socket = new WebSocket("ws://localhost:8080");

interface Message {
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, { text: event.data }]);
    };
  }, []);

  const joinRoom = () => {
    if (room.trim()) {
      socket.send(
        JSON.stringify({ type: "join", payload: { roomId: room } })
      );
    }
  };

  const sendMessage = () => {
    if (input.trim() && room) {
      socket.send(
        JSON.stringify({ type: "chat", payload: { message: input, roomId: room } })
      );
      setInput(""); // Clear input after sending
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-100 shadow-lg p-4">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={joinRoom}
        >
          Join
        </button>
      </div>
      <div className="flex-1 overflow-y-auto border p-3 rounded bg-white">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-200 my-1 rounded">
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-800 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
