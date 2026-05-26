import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

// Components
import Sidebar from "../components/layout/Sidebar";
import UserPanel from "../components/layout/UserPanel";
import ChatHeader from "../components/layout/ChatHeader";

import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

const ChatPage = () => {
  const navigate = useNavigate();

  const { socket, onlineUsers = [] } = useSocket();

  // ==============================
  // STATE
  // ==============================
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");

  const [showUserPanel, setShowUserPanel] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // ==============================
  // LOAD USER
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
  // SOCKET REGISTER
  // ==============================
  useEffect(() => {
    if (socket && currentUser?._id) {
      socket.emit("addUser", currentUser._id);
    }
  }, [socket, currentUser]);

  // ==============================
  // FETCH USERS
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

        const filteredUsers = allUsers.filter(
          (user) => user._id !== currentUser._id
        );

        setUsers(filteredUsers);

        if (filteredUsers.length > 0 && !selectedUser) {
          setSelectedUser(filteredUsers[0]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // ==============================
  // FETCH MESSAGES
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
  // RECEIVE REALTIME MESSAGE
  // ==============================
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (data) => {
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
  // AUTO SCROLL
  // ==============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==============================
  // SEND MESSAGE
  // ==============================
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser || !currentUser) return;

    const messageText = message.trim();

    setMessage("");

    try {
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

      const savedMessage = res.data.data;

      if (!savedMessage) {
        throw new Error("No message returned from server");
      }

      // SHOW IN UI
      setMessages((prev) => [...prev, savedMessage]);

      // REALTIME
      socket?.emit("sendMessage", savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);

      setMessage(messageText);
    }
  };

  // ==============================
  // LOGOUT
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
  // FILTER USERS
  // ==============================
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // LOADING
  // ==============================
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 dark:bg-slate-950">
        <p className="text-purple-600 dark:text-white text-lg font-medium">
          Loading...
        </p>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================
  return (
    <div className="h-screen bg-purple-50 dark:bg-slate-950 text-gray-900 dark:text-white flex overflow-hidden transition-colors duration-300">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex">
        <Sidebar
          currentUser={currentUser}
          showUserPanel={showUserPanel}
          setShowUserPanel={setShowUserPanel}
          onLogout={handleLogout}
        />
      </div>

      {/* USER PANEL */}
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

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

        {/* HEADER */}
        <div className="shrink-0">
          <ChatHeader
            selectedUser={selectedUser}
            onlineUsers={onlineUsers}
            setShowUserPanel={setShowUserPanel}
            setShowMobileMenu={setShowMobileMenu}
            onLogout={handleLogout}
          />
        </div>

        {/* MOBILE MENU */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 md:hidden flex">

            {/* OVERLAY */}
            <div
              className="flex-1 bg-black/40"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* DRAWER */}
            <div className="w-72 bg-white dark:bg-slate-900 shadow-2xl p-5 overflow-y-auto">

              {/* TOP */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Menu
                </h2>

                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* USER */}
              <div className="flex items-center gap-3 mb-8">

                <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-200">
                  {currentUser?.profilePic ? (
                    <img
                      src={`https://koode-23xz.onrender.com/${currentUser.profilePic}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold">
                      {currentUser?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
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

              {/* SEARCH USERS */}
              <button
                onClick={() => {
                  setShowUserPanel(true);
                  setShowMobileMenu(false);
                }}
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition"
              >
                Search Users
              </button>

              {/* DARK MODE */}
              <button
                onClick={() => {
                  document.documentElement.classList.toggle("dark");
                }}
                className="w-full mb-4 bg-slate-200 dark:bg-slate-800 py-3 rounded-xl transition"
              >
                Toggle Theme
              </button>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* CHAT BODY */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-hidden">
            <MessageList
              messages={messages}
              currentUser={currentUser}
              selectedUser={selectedUser}
              messagesEndRef={messagesEndRef}
            />
          </div>

          {/* FIXED INPUT */}
          <div className="shrink-0 sticky bottom-0 z-40 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-slate-800">
            <MessageInput
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              disabled={!selectedUser}
              currentUser={currentUser}
              selectedUser={selectedUser}
              socket={socket}
              setMessages={setMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;