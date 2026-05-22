import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("https://koode-23xz.onrender.com", {
      withCredentials: true,
    });

    setSocket(newSocket);

    // Listen for online users list
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);