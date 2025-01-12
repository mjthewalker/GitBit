import { useState } from "react";
import axios from "axios";
import { Send, TreePine, Leaf, Wind } from "lucide-react";

export default function ChatBot({ expanded }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageSend = () => {
    if (input.trim()) {
      const userMessage = { type: "sent", text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setIsLoading(true);
      axios
        .post(`http://localhost:8000/chat/query/USER_ID`, { query: input })
        .then((response) => {
          const result = response.data.result;
          const chatAnswerIndex = result.indexOf("Chat Answer:");
          let answer = result;
          if (chatAnswerIndex !== -1) {
            answer = result
              .substring(chatAnswerIndex + "Chat Answer:".length)
              .trim();
          }

          const botMessage = { type: "received", text: answer };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        })
        .catch((error) => {
          console.error("Error sending query:", error);
          const errorMessage = {
            type: "received",
            text: "Something went wrong. Please try again later.",
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
        })
        .finally(() => {
          setIsLoading(false);
        });

      setInput("");
    }
  };

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 ${
        expanded ? "ml-[21%]" : "ml-24"
      } transition-all `}
    >
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-green-200 animate-pulse">
        <Leaf className="w-16 h-16" />
      </div>
      <div className="absolute bottom-10 right-10 text-green-200 animate-pulse delay-300">
        <Wind className="w-16 h-16" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-3 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-4">
              <TreePine className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                EcoChat Assistant
              </h1>
            </div>
            <p className="text-green-700/70">Your sustainable conversation companion</p>
          </div>

          {/* Chat Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Messages Area */}
            <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-green-800/60">
                  <TreePine className="h-16 w-16" />
                  <p className="text-lg">Start your eco-friendly conversation!</p>
                  <p className="text-sm">Ask me anything about sustainability and carbon credits</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.type === "sent" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                        msg.type === "sent"
                          ? "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-none"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 text-green-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm md:text-base leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm">Thinking sustainably...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gradient-to-b from-white/50 to-gray-50 border-t border-green-100">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-xl border border-green-100 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm"
                  placeholder="Type your eco-friendly message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleMessageSend()}
                />
                <button
                  onClick={handleMessageSend}
                  className="p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}