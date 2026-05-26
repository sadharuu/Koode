import { Time } from "../../utils/Time";

const MessageList = ({
  messages,
  currentUser,
  selectedUser,
  messagesEndRef,
}) => {
  return (
    <div
      className="
        flex-1
        overflow-y-auto
        px-3
        md:px-6
        py-4
        pb-28
        space-y-4
        bg-gradient-to-b
        from-purple-50
        to-white
        dark:from-slate-950
        dark:to-slate-900
        scroll-smooth
      "
    >
      {/* EMPTY CHAT */}
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center px-4">
          <p className="text-gray-400 dark:text-slate-500 text-sm md:text-base">
            {selectedUser
              ? `Start a conversation with ${selectedUser.username} 👋`
              : "Select a user to start chatting"}
          </p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMine =
            msg.senderId === currentUser?._id ||
            msg.senderId?._id === currentUser?._id;

          return (
            <div
              key={msg._id || index}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  relative
                  max-w-[85%]
                  md:max-w-[70%]
                  rounded-2xl
                  px-4
                  py-3
                  shadow-md
                  break-words
                  transition-all
                  duration-300
                  backdrop-blur-sm
                  ${
                    isMine
                      ? `
                        bg-gradient-to-r
                        from-purple-600
                        to-violet-500
                        text-white
                        rounded-br-md
                      `
                      : `
                        bg-purple-100
                        dark:bg-slate-800
                        text-purple-900
                        dark:text-white
                        rounded-bl-md
                      `
                  }
                `}
              >
                {/* MESSAGE TEXT */}
                {msg.message && (
                  <p
                    className="
                      whitespace-pre-wrap
                      break-words
                      text-sm
                      md:text-base
                      leading-relaxed
                    "
                  >
                    {msg.message}
                  </p>
                )}

                {/* IMAGE */}
                {msg.image && (
                  <div className="mt-3 overflow-hidden rounded-2xl">
                    <img
                      src={msg.image}
                      alt="chat"
                      loading="lazy"
                      className="
                        max-h-[320px]
                        w-full
                        object-cover
                        rounded-2xl
                        border
                        border-white/10
                        hover:scale-[1.02]
                        transition-transform
                        duration-300
                        cursor-pointer
                      "
                    />
                  </div>
                )}

                {/* TIME */}
                <p
                  className={`
                    mt-2
                    text-[10px]
                    md:text-[11px]
                    text-right
                    ${
                      isMine
                        ? "text-purple-100"
                        : "text-purple-500 dark:text-slate-400"
                    }
                  `}
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