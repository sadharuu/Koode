import { useRef, useState } from "react";
import {
  FaSmile,
  FaPaperPlane,
  FaCamera,
} from "react-icons/fa";

import axios from "axios";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  disabled = false,
  currentUser,
  selectedUser,
  socket,
  setMessages,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  const emojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "👍",
    "❤️",
    "🔥",
    "🎉",
    "🙏",
  ];

  // ==============================
  // SEND TEXT MESSAGE
  // ==============================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);

    setShowEmojiPicker(false);
  };

  // ==============================
  // IMAGE UPLOAD
  // ==============================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || !currentUser || !selectedUser) return;

    try {
      const formData = new FormData();

      formData.append("image", file);

      formData.append("senderId", currentUser._id);

      formData.append("receiverId", selectedUser._id);

      const res = await axios.post(
        "https://koode-23xz.onrender.com/message/uploadimage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const savedMessage = res.data.data;

      // Show instantly
      setMessages((prev) => [...prev, savedMessage]);

      // Realtime socket
      socket?.emit("sendMessage", savedMessage);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <div className="sticky bottom-0 z-40 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-slate-800 px-3 md:px-5 py-3">
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50 w-64 rounded-2xl border border-purple-100 bg-white p-4 shadow-2xl dark:bg-slate-900">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="rounded-lg p-2 text-2xl hover:bg-purple-50 dark:hover:bg-purple-900"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() =>
            setShowEmojiPicker(!showEmojiPicker)
          }
          className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition hover:bg-purple-200 dark:bg-slate-800 dark:hover:bg-purple-900"
        >
          <FaSmile size={20} />
        </button>

        {/* INPUT WRAPPER */}
        <div className="relative flex-1">
          
          {/* Message Input */}
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="w-full rounded-full border-2 border-purple-100 px-5 py-3 pr-14 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-slate-900 dark:text-white"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Camera Icon */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 dark:text-purple-400"
          >
            <FaCamera size={18} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={disabled || !message.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaPaperPlane size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;