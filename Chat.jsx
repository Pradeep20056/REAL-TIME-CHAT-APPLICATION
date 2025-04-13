import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const socket = new WebSocket('ws://localhost:3001');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, timestamp: new Date() };
      socket.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 text-white p-4">
      <motion.h1
        className="text-3xl font-extrabold mb-6 text-center drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ⚡ Real-Time Chat App
      </motion.h1>

      <div className="flex-1 overflow-auto bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg space-y-3">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className="bg-white/20 text-white px-4 py-2 rounded-xl shadow-md max-w-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="text-sm text-white/80">
              {new Date(msg.timestamp).toLocaleTimeString()}:
            </span>
            <div className="font-semibold">{msg.text}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg outline-none text-black font-medium shadow-inner"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 hover:bg-pink-600 transition-all text-white px-6 py-3 rounded-r-lg font-bold shadow-md"
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
};

export default Chat;
