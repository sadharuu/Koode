import { useRef, useState } from "react";
import {
  FaSmile,
  FaPaperPlane,
  FaCamera,
  FaTimes,
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
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const [uploading, setUploading] = useState(false);

  const [previewImage, setPreviewImage] =
    useState(null);

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

    if (!file || !currentUser || !selectedUser) {
      return;
    }

    // Preview
    

    URL.revokeObjectURL(previewImage);
    setPreviewImage(null);

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("image", file);

      formData.append(
        "senderId",
        currentUser._id
      );

      formData.append(
        "receiverId",
        selectedUser._id
      );

      const res = await axios.post(
        "https://koode-23xz.onrender.com/message/uploadimage",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          withCredentials: true,
        }
      );

      const savedMessage = res.data.data;

      // Show instantly
      setMessages((prev) => [
        ...prev,
        savedMessage,
      ]);

      // Socket realtime
      socket?.emit(
        "sendMessage",
        savedMessage
      );

      // Remove preview after upload
      setPreviewImage(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(
        "Image upload failed:",
        error
      );

      setPreviewImage(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="
        sticky
        bottom-0
        z-40
        bg-white
        dark:bg-slate-900
        border-t
        border-purple-100
        dark:border-slate-800
        px-3
        md:px-5
        py-3
        backdrop-blur-md
      "
    >
      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="mb-3 relative w-fit">
          <img
            src={previewImage}
            alt="preview"
            className="
              h-24
              rounded-2xl
              border
              border-purple-200
              object-cover
            "
          />

          <button
            onClick={() =>
              setPreviewImage(null)
            }
            className="
              absolute
              -top-2
              -right-2
              bg-red-500
              text-white
              rounded-full
              p-1
              shadow-lg
            "
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}

      {/* EMOJI PICKER */}
      {showEmojiPicker && (
        <div
          className="
            absolute
            bottom-20
            left-4
            z-50
            w-64
            rounded-2xl
            border
            border-purple-100
            bg-white
            dark:bg-slate-900
            p-4
            shadow-2xl
          "
        >
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  addEmoji(emoji)
                }
                className="
                  rounded-lg
                  p-2
                  text-2xl
                  hover:bg-purple-50
                  dark:hover:bg-purple-900
                  transition
                "
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT AREA */}
      <div className="flex items-center gap-3">
        {/* EMOJI BUTTON */}
        <button
          type="button"
          onClick={() =>
            setShowEmojiPicker(
              !showEmojiPicker
            )
          }
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-purple-100
            text-purple-600
            transition
            hover:bg-purple-200
            dark:bg-slate-800
            dark:hover:bg-purple-900
          "
        >
          <FaSmile size={20} />
        </button>

        {/* INPUT WRAPPER */}
        <div className="relative flex-1">
          {/* TEXT INPUT */}
          <input
            type="text"
            placeholder={
              disabled
                ? "Select a user..."
                : "Type a message..."
            }
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="
              w-full
              rounded-full
              border-2
              border-purple-100
              bg-white
              dark:bg-slate-800
              dark:text-white
              px-5
              py-3
              pr-14
              outline-none
              focus:border-purple-500
              focus:ring-4
              focus:ring-purple-100
              disabled:cursor-not-allowed
              disabled:bg-gray-100
              dark:disabled:bg-slate-700
              transition
            "
          />

          {/* HIDDEN FILE INPUT */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* CAMERA BUTTON */}
          <button
            type="button"
            disabled={uploading || disabled}
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-purple-600
              hover:text-purple-800
              dark:text-purple-400
              transition
              disabled:opacity-50
            "
          >
            <FaCamera size={18} />
          </button>
        </div>

        {/* SEND BUTTON */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={disabled || uploading || !message.trim()}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-gradient-to-r
            from-purple-600
            to-violet-500
            text-white
            transition
            hover:opacity-95
            disabled:cursor-not-allowed
            disabled:opacity-50
            shadow-lg
          "
        >
          <FaPaperPlane size={18} />
        </button>
      </div>

      {/* UPLOADING TEXT */}
      {uploading && (
        <p className="mt-2 text-xs text-purple-500">
          Uploading image...
        </p>
      )}
    </div>
  );
};

export default MessageInput;