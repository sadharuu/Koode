import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />}  />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
