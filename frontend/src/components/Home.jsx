import { useEffect, useState } from "react";
import StockAutocomplete from "./StockAutoComplete";
import axios from "axios";
import './Home.css'

import {
  Leaf,
  TreePine,
  Sprout,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Send,
} from "lucide-react";
const CustomDropdown = ({ value, onChange, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = type === "asset" ? ["Stock", "Crypto", "Real Estate"] : ["Buy", "Sell"];
  const handleSelect = (option) => {
    onChange({ target: { name: type == "asset" ? "assetType" : "transactionType", value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer py-3 px-6 rounded-lg border border-green-200 bg-white/90 focus:ring-2 focus:ring-green-500 flex justify-between items-center"
      >
        <span className="text-gray-700">{value || "Select Asset Type"}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute mt-2 w-full bg-white rounded-lg border border-green-200 shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-6 py-3 cursor-pointer hover:bg-green-100"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const Home = ({ expanded }) => {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);   
  const [transactionForm, setTransactionForm] = useState({
    transactionType: "Buy",
    assetName: "",
    assetType: "",
    assetCode: "",
    amount: "",
    quantity: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8000/portfolio/add`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...transactionForm,
          amount: parseFloat(transactionForm.amount),
          quantity: parseFloat(transactionForm.quantity),
          assetCode: transactionForm.assetCode,
        }),
        
      });
      console.log(transactionForm);
  
      if (response.ok) {
        // Reset form
        setTransactionForm({
          transactionType: "Buy",
          assetName: "",
          assetType: "",
          assetCode: "",
          amount: "",
          quantity: "",
          transactionDate: new Date().toISOString().split("T")[0],
        });

        // Refresh portfolio data
        if (user?.id) {
          const portfolioResponse = await fetch(
            `http://localhost:8000/portfolio/${user._id}`
          );
          if (portfolioResponse.ok) {
            const data = await portfolioResponse.json();
            setPortfolio(data);
          }
        }
  
        // Show success message
        alert("Transaction added successfully!");
      } else {
        alert("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error adding transaction. Please try again.");
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isChatboxExpanded && !isRequestSent) {
      setIsLoading(true);  // Set loading to true when the request is about to be sent

      axios.get(`http://localhost:8000/chat/${user._id}`)
        .then((response) => {
          console.log("Initial request sent", response.data);
          setIsRequestSent(true);
          setIsLoading(false);  // Set loading to false when the response is received
        })
        .catch((error) => {
          console.error("Error sending initial request:", error);
          setIsLoading(false);  // Set loading to false in case of an error
        });
    }
  }, [isChatboxExpanded, isRequestSent]);

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
        }
      } catch (error) {
        console.log("Network error:", error);
      }
    };

    const fetchPortfolioData = async () => {
      if (!user?._id) {
        console.log("User ID is not available.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/portfolio/${user._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("My portfolio data:", data);
          setPortfolio(data);
        } else {
          console.log("Failed to fetch portfolio. Status:", response.status);
        }
      } catch (error) {
        console.log("Portfolio fetch error:", error);
      }
    };

    fetchUserData();
    if (user?._id) fetchPortfolioData();
  }, [user?._id]);

  const toggleChatbox = () => setIsChatboxExpanded((prev) => !prev);

  const handleMessageSend = () => {
    if (input.trim()) {
      axios
        .post(`http://localhost:8000/chat/query/${user._id}`, { query: input })
        .then((response) => {
          console.log("Query response:", response.data);
  
          // Extract content after "Chat Answer:"
          const result = response.data.result;
          const chatAnswerIndex = result.indexOf("Chat Answer:");
          
          if (chatAnswerIndex !== -1) {
            const answer = result.substring(chatAnswerIndex + "Chat Answer:".length).trim();
            
            // Add the extracted answer to the messages
            const newMessage = { type: "received", text: answer };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        })
        .catch((error) => {
          console.error("Error sending query:", error);
        });
  
      const newMessage = { type: "sent", text: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
    }
  };  

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-14 transition-all px-10 ${
        expanded ? "ml-64" : "ml-20"
      }`}
    >
      <div className={`p-8 ${isChatboxExpanded ? "blur-sm" : ""}`}>
        {/* Portfolio Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 flex items-center gap-2">
            <TreePine className="h-8 w-8" />
            Sustainable Portfolio
          </h1>
          <p className="text-green-600 mt-2">Growing wealth responsibly</p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <h3 className="text-green-700 font-semibold">Total Value</h3>
              <Leaf className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {formatCurrency(portfolio?.totalValue || 0)}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <h3 className="text-green-700 font-semibold">Risk Profile</h3>
              <Sprout className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {portfolio?.riskProfile || "Medium"}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <h3 className="text-green-700 font-semibold">Last Updated</h3>
              <TreePine className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {portfolio?.lastUpdated
                ? formatDate(portfolio.lastUpdated)
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-green-600 text-white"
                : "bg-white/50 text-green-700 hover:bg-white/80"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "investments"
                ? "bg-green-600 text-white"
                : "bg-white/50 text-green-700 hover:bg-white/80"
            }`}
          >
            Investments
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "transactions"
                ? "bg-green-600 text-white"
                : "bg-white/50 text-green-700 hover:bg-white/80"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("add-transaction")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "add-transaction"
                ? "bg-green-600 text-white"
                : "bg-white/50 text-green-700 hover:bg-white/80"
            }`}
          >
            Add Transaction
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-green-100">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Portfolio Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-green-700 font-semibold">
                    Asset Distribution
                  </h3>
                  {portfolio?.investments?.map((investment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white/50 p-3 rounded-lg"
                    >
                      <span className="text-green-800">
                        {investment.assetName}
                      </span>
                      <span className="font-medium text-green-700">
                        {formatCurrency(investment.currentValue)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="text-green-700 font-semibold">
                    Recent Activity
                  </h3>
                  {portfolio?.transactions
                    ?.slice(0, 5)
                    .map((transaction, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white/50 p-3 rounded-lg"
                      >
                        <div>
                          <span className="text-green-800">
                            {transaction.assetName}
                          </span>
                          <span className="text-sm text-green-600 block">
                            {formatDate(transaction.transactionDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {transaction.transactionType === "Buy" ? (
                            <ArrowUpRight className="text-green-500 h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="text-red-500 h-4 w-4" />
                          )}
                          <span
                            className={`font-medium ${
                              transaction.transactionType === "Buy"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "investments" && (
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Investment Details
              </h2>
              <div className="space-y-4">
                {portfolio?.investments?.map((investment, index) => (
                  <div key={index} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-green-800">
                        {investment.assetName}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {investment.assetType}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-green-600">
                          Amount Invested
                        </p>
                        <p className="font-medium text-green-800">
                          {formatCurrency(investment.amountInvested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Current Value</p>
                        <p className="font-medium text-green-800">
                          {formatCurrency(investment.currentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Quantity</p>
                        <p className="font-medium text-green-800">
                          {investment.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Purchase Date</p>
                        <p className="font-medium text-green-800">
                          {formatDate(investment.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Transaction History
              </h2>
              <div className="space-y-4">
                {portfolio?.transactions?.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-white/50 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-green-800">
                        {transaction.assetName}
                      </h3>
                      <p className="text-sm text-green-600">
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.transactionType === "Buy"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType}:{" "}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-green-600">
                        Quantity: {transaction.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "add-transaction" && (
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                Add New Transaction
              </h2>
              <form
                onSubmit={handleTransactionSubmit}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Transaction Type
                    </label>
                    <CustomDropdown
                      value={transactionForm.transactionType}
                      onChange={handleInputChange}
                    />
                  </div>

                  <StockAutocomplete
                      value={transactionForm.assetName}
                      onChange={({ assetName, assetCode }) => {
                        setTransactionForm(prev => ({
                          ...prev,
                          assetName,
                          assetCode
                        }));
                      }}
                    />

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Asset Type
                    </label>
                    <CustomDropdown
                      value={transactionForm.assetType}
                      onChange={handleInputChange}
                      type="asset"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={transactionForm.amount}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={transactionForm.quantity}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90"
                      required
                      min="0"
                      step="0.000001"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Transaction Date
                    </label>
                    <input
                      type="date"
                      name="transactionDate"
                      value={transactionForm.transactionDate}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <TreePine className="h-5 w-5" />
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Chatbox */}
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
                  display: "inline-block",
                  maxWidth: "55%",
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center">
                <div className="loader"></div> {/* Display the loading spinner */}
              </div>
            )}
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
    </div>
  );
};

export default Home;
