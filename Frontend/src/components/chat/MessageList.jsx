import { Time } from "../../utils/Time";

const MessageList = ({
  messages,
  currentUser,
  selectedUser,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
      
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400 dark:text-slate-500">
          {selectedUser
            ? `Start a conversation with ${selectedUser.username}`
            : "Select a user to start chatting"}
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMine = msg.senderId === currentUser?._id;

          return (
            <div
              key={index}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[85%] md:max-w-[70%]
                  px-4 py-3 rounded-2xl shadow-sm
                  break-words
                  ${
                    isMine
                      ? "bg-gradient-to-r from-purple-600 to-violet-500 text-white rounded-br-md"
                      : "bg-purple-100 dark:bg-slate-800 text-purple-900 dark:text-white rounded-bl-md"
                  }
                `}
              >
                {/* MESSAGE */}
                {msg.message && (
                  <p className="whitespace-pre-wrap break-words text-sm md:text-base">
                    {msg.message}
                  </p>
                )}

                {msg.image && (
                  <img
                    src={`https://koode-23xz.onrender.com/${msg.image}`}
                    alt="chat"
                    className="mt-2 max-w-full rounded-xl"
                  />
                )}

                {/* TIME */}
                <p
                  className={`mt-1 text-[11px] ${
                    isMine
                      ? "text-purple-100"
                      : "text-purple-500 dark:text-slate-400"
                  }`}
                >
                  {Time(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })
      )}

      {/* AUTO SCROLL */}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;