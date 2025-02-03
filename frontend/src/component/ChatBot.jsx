import React, { useState } from "react";
import { Send } from "lucide-react";
import "../style/ChatBot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    setTimeout(() => {
      const botReply = { text: "I'm just a simple chatbot!", sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="chatbot-container" id="chatbot">
      <h2 className="chatbot-heading">Chatbot</h2>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-box"
        />
        <button onClick={handleSend} className="send-button">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
