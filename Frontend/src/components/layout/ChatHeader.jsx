import { useState, useEffect } from "react";

const ChatHeader = ({
  selectedUser,
  onlineUsers = [],
  setShowUserPanel,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isOnline = (userId) => onlineUsers.includes(userId);

  // Load theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setDarkMode(!darkMode);
  };

  return (
    <div className="relative bg-white dark:bg-slate-950 border-b border-purple-100 dark:border-slate-800 px-4 md:px-6 py-4 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* LEFT SIDE */}
        {selectedUser ? (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-200">
                {selectedUser?.profilePic ? (
                  <img src={`https://koode-23xz.onrender.com/${selectedUser.profilePic}`} alt="Profile" className="w-full h-full object-cover"/>
                  ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-lg">
                    {selectedUser.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Online Dot */}
              {isOnline(selectedUser._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-950"></span>
              )}
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-white">
                {selectedUser.username}
              </h2>

              <p
                className={`text-xs md:text-sm ${
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
          <h2 className="text-sm md:text-lg font-semibold text-gray-500 dark:text-gray-300">
            Select a user to start chatting
          </h2>
        )}

        {/* DESKTOP BUTTON */}
        <button
          onClick={() => setShowUserPanel((prev) => !prev)}
          className="hidden md:block rounded-xl bg-purple-100 dark:bg-slate-800 px-4 py-2 font-medium text-purple-700 dark:text-purple-300 transition hover:bg-purple-200 dark:hover:bg-slate-700"
        >
          Search Users
        </button>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-purple-100 dark:bg-slate-800 flex items-center justify-center text-xl text-purple-700 dark:text-white"
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="absolute right-4 top-16 z-50 w-52 rounded-2xl border border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Search Users */}
          <button
            onClick={() => {
              setShowUserPanel((prev) => !prev);
              setMenuOpen(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white transition"
          >
            🔍 Search Users
          </button>

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;