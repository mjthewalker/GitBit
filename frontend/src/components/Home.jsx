import { useEffect, useState } from "react";

const Home = ({ expanded }) => {
  const [user, setUser] = useState(null);
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false); // State to toggle chatbox size
  const [messages, setMessages] = useState([]); // Store chat messages
  const [input, setInput] = useState(""); // Store input message

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/user/userData", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);
          setUser(data.user);
        } else {
          console.log("Error fetching user data:", await response.json());
        }
      } catch (error) {
        console.log("Network error:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleChatbox = () => {
    setIsChatboxExpanded((prev) => !prev);
  };

  const handleMessageSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, type: "sent" }]);
      setInput("");

      // Simulate chatbot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Hello", type: "received" },
        ]);
      }, 1000); // Simulate chatbot delay
    }
  };

  return (
    <div
      className={`flex justify-center py-6 sm:px-6 lg:px-8 ${
        expanded ? "ml-64" : "ml-20"
      }`}
    >
      <div className={`w-full ${isChatboxExpanded ? "blur-sm" : ""}`}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat,
        laboriosam ducimus eaque quas blanditiis, nesciunt possimus tempora
        architecto aperiam ea ipsam dicta alias repudiandae voluptate? Autem
      </p>
      </div>
      <div className="w-full max-w-lg fixed bottom-6 right-6">
        {/* Toggle button for expanding chatbox */}
        {isChatboxExpanded && (
        <button
          className="mb-4 px-2 bg-green-600 text-white rounded"
          onClick={toggleChatbox}
        >
          {isChatboxExpanded ? "v" : "Expand Chat"}
        </button>
        )}

        {/* Chatbox */}
        <div
          className={`w-full px-5 bg-gray-100 rounded-lg overflow-y-auto ${
            isChatboxExpanded ? "h-80" : "h-0"
          } transition-all`}
        >
          <div className="flex py-5 flex-col flex-wrap space-y-4">
            {/* Display Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg break-words ${
                  msg.type === "sent"
                    ? "bg-green-600 text-white ml-auto flex-end"
                    : "bg-gray-500 text-white flex-start mr-auto"
                }`}
                style={{
                  display: "inline-block", // Ensures the box adjusts to the content
                  maxWidth: "50%", // Restricts the width to 50% of the parent
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        {/* Input field and Send Button */}
        <div className="mt-4 flex items-center space-x-2">
          <input
          onClick={() => setIsChatboxExpanded(true)}
            type="text"
            className="flex-grow p-3 border rounded-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What is Carbon Credits?"
          />
          <button
            onClick={handleMessageSend}
            className="p-3 bg-green-600 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;