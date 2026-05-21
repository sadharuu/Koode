// src/components/layout/UserPanel.jsx

const UserPanel = ({
  users,
  selectedUser,
  setSelectedUser,
  search,
  setSearch,
  setMessages,
  setShowUserPanel,
  onlineUsers = [],
}) => {
  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="w-80 bg-white border-r border-purple-100 dark:bg-slate-950 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-purple-100">
        <h2 className="text-xl font-bold text-purple-700 mb-3">
          Find Users
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-3">
        {users.length === 0 ? (
          <p className="mt-6 text-center text-sm text-gray-500">
            No users found
          </p>
        ) : (
          users.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setShowUserPanel(false);
                setMessages([]); // Clear current messages
              }}
              className={`w-full text-left p-3 rounded-2xl transition mb-2${
                selectedUser?._id === user._id
                  ? "bg-purple-100 dark:bg-purple-700 border border-purple-200"
                  : "hover:bg-purple-50 dark:hover:bg-purple-700" 
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold">
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </div>

                  {/* Online Indicator */}
                  {isOnline(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 dark:text-white truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPanel;