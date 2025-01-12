import React, { useState } from 'react';
import { ChevronDown, Send } from 'react-icons'; // Assuming you're using react-icons

const Chatbox = () => {
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbox = () => {
    setIsChatboxExpanded(!isChatboxExpanded);
  };

  const handleMessageSend = () => {
    if (input.trim()) {
      const newMessage = { type: "sent", text: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-lg fixed bottom-6 right-6">
      {isChatboxExpanded && (
        <button
          className="mb-4 px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1 hover:bg-green-700 transition-colors"
          onClick={toggleChatbox}
        >
          <ChevronDown className="h-4 w-4" />
          Minimize
        </button>
      )}

      <div
        className={`w-full bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-green-100 transition-all ${
          isChatboxExpanded ? "h-96" : "hidden"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex flex-col p-4 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 mt-[35%]">
                No messages yet...
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg break-words mb-2 ${
                  msg.type === "sent"
                    ? "bg-green-600 text-white ml-auto flex-end"
                    : "bg-gray-100 text-green-800 mr-auto flex-start"
                }`}
                style={{
                  display: "inline-block", // Ensures the box adjusts to the content
                  maxWidth: "55%", // Restricts the width to 50% of the parent
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg border border-green-200 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={() => setIsChatboxExpanded(true)}
          placeholder="Ask about sustainable investing..."
          onKeyPress={(e) => e.key === "Enter" && handleMessageSend()}
        />
        <button
          onClick={handleMessageSend}
          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
