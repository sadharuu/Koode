import { Time } from "../../utils/Time";

const MessageList = ({
  messages,
  currentUser,
  selectedUser,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900 px-6 py-4 transition-colors duration-300">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400 dark:text-slate-400">
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
              className={`mb-4 flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm transition-colors duration-300 ${
                  isMine
                    ? "rounded-br-md bg-gradient-to-r from-purple-600 to-violet-500 text-white"
                    : "rounded-bl-md bg-purple-100 text-purple-900 dark:bg-slate-800 dark:text-slate-100"
                }`}
              >
                {/* Message Text */}
                <p className="break-words">{msg.message}</p>

                {/* Time */}
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

      {/* Auto Scroll Anchor */}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;