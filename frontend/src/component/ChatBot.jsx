import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import "../style/ChatBot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const botResponses = (message) => {
    const text = message.toLowerCase();
    if (text.includes("hello") || text.includes("hi")) return "Hi there! How can I help?";
    if (text.includes("how are you")) return "I'm just a bot, but I'm doing great! Thanks for asking.";
    if (text.includes("your name")) return "I'm a simple chatbot!";
    return "I'm just a simple chatbot!";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    setIsTyping(true);
    setTimeout(() => {
      const botReply = { text: botResponses(input), sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chatbot-container" id="chatbot">
      <h2 className="chatbot-heading">Chatbot</h2>
      <div className="chatbot-messages" ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isTyping && <div className="chat-message bot">Typing...</div>}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-box"
        />
        <button onClick={handleSend} className="send-button">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
