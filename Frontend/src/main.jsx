import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketProvider } from "./context/SocketContext";
import "./index.css";


const user = JSON.parse(localStorage.getItem("user"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider user={user}>
      <App />
    </SocketProvider>
  </React.StrictMode>
);


