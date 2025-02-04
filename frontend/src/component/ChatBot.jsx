import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import "../style/ChatBot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const chatRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat/interactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: input }),
      });

      const data = await response.json();
      const botReply = { text: data.response, sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      const errorMessage = { text: "Oops! Something went wrong.", sender: "bot" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
        {isTyping && <div className="chat-message bot typing">Typing...</div>}
      </div>
      <div className="chatbot-suggestions">
        <button onClick={() => setInput("Tell me about alumni")}>Ask about alumni</button>
        <button onClick={() => setInput("What are the upcoming events?")}>Upcoming events</button>
        <button onClick={() => setInput("How to register?")}>Registration help</button>
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