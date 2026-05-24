import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

// Layout Components
import Sidebar from "../components/layout/Sidebar";
import UserPanel from "../components/layout/UserPanel";
import ChatHeader from "../components/layout/ChatHeader";

// Chat Components
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

const ChatPage = () => {
  const navigate = useNavigate();
  const { socket, onlineUsers = [] } = useSocket();

  // ==============================
  // State
  // ==============================
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [showUserPanel, setShowUserPanel] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ==============================
  // Load current user from localStorage
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      navigate("/");
    }
  }, [navigate]);

  // ==============================
  // Register current user in Socket.IO
  // ==============================
  useEffect(() => {
    if (socket && currentUser?._id) {
      socket.emit("addUser", currentUser._id);
    }
  }, [socket, currentUser]);

  // ==============================
  // Fetch all users
  // ==============================
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://koode-23xz.onrender.com/user/showuser",
          {
            withCredentials: true,
          }
        );

        const allUsers = res.data.data || [];

        // Remove current user
        const filtered = allUsers.filter(
          (user) => user._id !== currentUser._id
        );

        setUsers(filtered);

        // Auto-select first user
        if (filtered.length > 0 && !selectedUser) {
          setSelectedUser(filtered[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // ==============================
  // Load chat history when selected user changes
  // ==============================
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://koode-23xz.onrender.com/message/showmessage/${currentUser._id}/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );

        const chatMessages = res.data.data || [];

        // Show welcome message if no chat exists
        if (chatMessages.length === 0) {
          setMessages([
            {
              senderId: "bot",
              message: `Start chatting with ${selectedUser.username} 👋`,
              createdAt: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages(chatMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);

        setMessages([
          {
            senderId: "bot",
            message: `Start chatting with ${selectedUser.username} 👋`,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    };

    fetchMessages();
  }, [currentUser, selectedUser]);

  // ==============================
  // Listen for real-time incoming messages
  // ==============================
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (data) => {
      // Show only if message belongs to current open conversation
      if (
        selectedUser &&
        data.senderId === selectedUser._id &&
        data.receiverId === currentUser._id
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, selectedUser, currentUser]);

  // ==============================
  // Auto scroll to latest message
  // ==============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==============================
  // Send Message
  // ==============================
  // Replace ONLY your handleSendMessage function in ChatPage.jsx with this code

  const handleSendMessage = async () => {
    // Prevent sending empty messages
    if (!message.trim() || !selectedUser || !currentUser) return;

  // Store current message text before clearing input
    const messageText = message.trim();

  // Clear the input immediately for better UX
    setMessage("");

    try {
    // 1. Save message to MongoDB
      const res = await axios.post(
        "https://koode-23xz.onrender.com/message/sendmessage",
        {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          message: messageText,
        },
        {
          withCredentials: true,
        }
      );

    // 2. Get saved message from backend
      const savedMessage = res.data.data;

      if (!savedMessage) {
        throw new Error("No message returned from server");
      }

    // 3. Show message immediately in sender UI
      setMessages((prev) => [...prev, savedMessage]);

    // 4. Send message in real time via Socket.IO
    // IMPORTANT: Your backend socket.js listens for "sendMessage"
      socket?.emit("sendMessage", savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);

      // Optional: restore message if sending fails
      setMessage(messageText);
    }
  };

  // ==============================
  // Logout
  // ==============================
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://koode-23xz.onrender.com/user/logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("user");

      socket?.disconnect();

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ==============================
  // Filter users by search
  // ==============================
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // Loading Screen
  // ==============================
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <p className="text-purple-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================
  // Replace ONLY the return statement in ChatPage.jsx with this code

  return (
    <div className="h-screen bg-purple-50 dark:bg-slate-950 text-gray-900 dark:text-white flex overflow-hidden transition-colors duration-300 hidden md:block">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        showUserPanel={showUserPanel}
        setShowUserPanel={setShowUserPanel}
        onLogout={handleLogout}
      />

      {/* User Search Panel */}
      {showUserPanel && (
        <UserPanel
          users={filteredUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          search={search}
          setSearch={setSearch}
          setMessages={setMessages}
          setShowUserPanel={setShowUserPanel}
          onlineUsers={onlineUsers}
        />
      )}

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
        {/* Header */}
        <ChatHeader
          selectedUser={selectedUser}
          onlineUsers={onlineUsers}
          setShowUserPanel={setShowUserPanel}
          setShowMobileMenu={setShowMobileMenu}
        />
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileMenu(false)}>
            </div>

          {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl p-5 transition-all duration-300">
      
              {/* Close */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">
                  Menu
                </h2>

                <button onClick={() => setShowMobileMenu(false)} className="text-2xl">
                  ✕
                </button>
              </div>

              {/* User */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold">
                    {currentUser?.username}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Online
                  </p>
                </div>
              </div>

              {/* Search User */}
              <button onClick={() => {setShowUserPanel(true); setShowMobileMenu(false);}} className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl">
                Search Users
              </button>

              {/* Theme Toggle */}
              <button onClick={() => {document.documentElement.classList.toggle("dark");}} className="w-full mb-4 bg-slate-200 dark:bg-slate-800 py-3 rounded-xl">
                Toggle Theme
              </button>

              {/* Logout */}
              <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl">
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
          <MessageList
            messages={messages}
            currentUser={currentUser}
            selectedUser={selectedUser}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-slate-800 transition-colors duration-300">
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            disabled={!selectedUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;