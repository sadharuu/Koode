import { useState } from "react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  disabled = false,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ["😀", "😂", "😍", "🥰", "😎", "👍", "❤️", "🔥", "🎉", "🙏"];

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

  return (
    <div className="relative border-t border-purple-100 bg-white p-4 dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50 w-64 rounded-2xl border border-purple-100 bg-white p-4 shadow-2xl dark:bg-slate-900">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="rounded-lg p-2 text-2xl hover:bg-purple-50 dark:bg-slate-900 dark:hover:bg-purple-900"
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
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition hover:bg-purple-200 dark:bg-slate-900 dark:hover:bg-purple-900"
        >
          <FaSmile size={20} />
        </button>

        {/* Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 rounded-full border-2 border-purple-100 px-5 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-slate-900 dark:text-white"
        />

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