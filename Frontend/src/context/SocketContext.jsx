import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Create socket connection
    const newSocket = io("https://koode-23xz.onrender.com", {
      withCredentials: true,

      transports: ["websocket", "polling"],

      reconnection: true,
    });

    // Save socket
    setSocket(newSocket);

    // CONNECT
    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
    });

    // ONLINE USERS
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // DISCONNECT
    newSocket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    // ERROR
    newSocket.on("connect_error", (err) => {
      console.log("Socket Error:", err.message);
    });

    // CLEANUP
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);