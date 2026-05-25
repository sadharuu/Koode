// src/components/layout/Sidebar.jsx

import logo from "../../images/koode_logo.png";
import { Time } from "../../utils/Time";
import { useEffect, useState } from "react";

const Sidebar = ({
  currentUser,
  showUserPanel,
  setShowUserPanel,
  onLogout,
}) => {
  // ============================
  // Dark Mode State
  // ============================
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ============================
  // Apply Dark Mode to <html>
  // ============================
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle Theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="w-20 bg-gradient-to-b from-purple-700 to-purple-900 dark:from-slate-900 dark:to-black text-white flex flex-col items-center py-6 shadow-xl transition-colors duration-300">
      {/* Logo */}
      <img
        src={logo}
        alt="Koode Logo"
        className="w-12 h-12 rounded-2xl object-contain bg-white p-1 shadow-md"
      />

      {/* App Name */}
      <h1 style={{ fontFamily: "'Playwrite AU SA', cursive",}} className="mt-3 text-xs font-semibold tracking-wide text-center">
        Koode
      </h1>
      <p style={{ fontFamily: "'Playwrite AU SA', cursive",}} className="text-[10px] text-white/70 text-center p-1">Where People Connect</p>
      {/* Search Users Button */}
      <button
        onClick={() => setShowUserPanel(!showUserPanel)}
        title="Search Users"
        className={`mt-8 w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 dark:from-slate-900 dark:to-black dark:text-white ${
          showUserPanel
            ? "bg-white text-purple-700 dark:text-slate-900 shadow-lg"
            : "bg-white/10 hover:bg-white/20 dark:hover:bg-purple-700"
        }`}
      >
        🔍
      </button>

      {/* Current User Avatar */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20">
          {currentUser?.profilePic ? 
            (<img src={`https://koode-23xz.onrender.com/${currentUser.profilePic}`} alt="Profile" className="w-full h-full object-cover"/>)
              :
            (<div className="w-full h-full flex items-center justify-center text-lg font-bold"> {currentUser?.username?.charAt(0).toUpperCase() || "U"}</div>
          )}
        </div>

        <p className="mt-2 text-[10px] text-center text-white/80 px-1">
          {currentUser?.username || "User"}
        </p>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className="mt-6 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 dark:hover:bg-purple-700 flex items-center justify-center text-xl transition-all duration-200"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Push remaining content to bottom */}
      <div className="flex-1"></div>

      {/* Time Display */}
      <div className="mb-4 text-center px-2">
        <p className="text-[10px] text-white/70">Local Time</p>
        <p className="text-[11px] font-medium leading-tight">
          {Time(new Date())}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        title="Logout"
        className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-red-500/80 flex items-center justify-center text-xl transition-all duration-200"
      >
        🚪
      </button>
    </div>
  );
};

export default Sidebar;