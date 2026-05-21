const ChatHeader = ({
  selectedUser,
  onlineUsers = [],
  setShowUserPanel,
}) => {
  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="bg-white border-b border-purple-100 dark:bg-slate-950 text-gray-900 dark:text-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {selectedUser ? (
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-lg">
                {selectedUser.username?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Online Indicator */}
              {isOnline(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>

            {/* User Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {selectedUser.username}
              </h2>
              <p
                className={`text-sm ${
                  isOnline(selectedUser._id)
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {isOnline(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-gray-500">
            Select a user to start chatting
          </h2>
        )}

        {/* Search Users Button */}
        <button
          onClick={() => setShowUserPanel((prev) => !prev)}
          className="rounded-xl bg-purple-100 px-4 py-2 font-medium text-purple-700 transition hover:bg-purple-200"
        >
          Search Users
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;