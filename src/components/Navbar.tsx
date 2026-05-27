import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigateToLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const navigateToProfile = () => {
    navigate("/profile");
    setUserDropdownOpen(false);
  };

  const navigateToDiaries = () => {
    navigate("/diaries");
    setMenuOpen(false);
  };

  const navigateToWinOfTheDay = () => {
    navigate("/wod");
    setMenuOpen(false);
  };

  const navigateToWrite = () => {
    navigate("/write");
    setMenuOpen(false);
  };

  const navigateToEvents = () => {
    navigate("/events");
    setMenuOpen(false);
  };

  const navigateToFriends = () => {
    navigate("/friends");
    setMenuOpen(false);
  };

  const navigateToHome = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      <h1
        onClick={navigateToHome}
        className="text-lg sm:text-xl font-semibold tracking-tight cursor-pointer hover:opacity-70 transition"
      >
        Unsent
      </h1>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
        {!isLoggedIn && (
          <>
            <a
              onClick={navigateToWinOfTheDay}
              className="hover:opacity-70 cursor-pointer"
            >
              Win of the Day
            </a>
          </>
        )}
        {isLoggedIn && (
          <>
            <a
              onClick={navigateToWrite}
              className="hover:opacity-70 cursor-pointer font-semibold"
            >
              ✏️ Write
            </a>
            <a
              onClick={navigateToDiaries}
              className="hover:opacity-70 cursor-pointer"
            >
              Diaries
            </a>
            <a
              onClick={navigateToFriends}
              className="hover:opacity-70 cursor-pointer"
            >
              Friends
            </a>
            <a
              onClick={navigateToEvents}
              className="hover:opacity-70 cursor-pointer"
            >
              Events
            </a>
          </>
        )}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
              className="text-lg cursor-pointer hover:opacity-70 transition"
              title="User Menu"
            >
              🚪
            </button>
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button
                  onClick={navigateToProfile}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition first:rounded-t-lg"
                >
                  👤 Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition last:rounded-b-lg border-t border-gray-100"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={navigateToLogin}
            className="rounded-full border px-4 py-1.5 hover:bg-black hover:text-white transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden flex flex-col gap-1.5 cursor-pointer"
        title="Menu"
      >
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black"></div>
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 p-4 sm:hidden z-50">
          <div className="flex flex-col gap-4">
            {!isLoggedIn && (
              <>
                <a
                  onClick={navigateToWinOfTheDay}
                  className="hover:opacity-70 cursor-pointer text-sm"
                >
                  Win of the Day
                </a>
              </>
            )}
            {isLoggedIn && (
              <>
                <a
                  onClick={navigateToWrite}
                  className="hover:opacity-70 cursor-pointer text-sm font-semibold"
                >
                  ✏️ Write
                </a>
                <a
                  onClick={navigateToDiaries}
                  className="hover:opacity-70 cursor-pointer text-sm"
                >
                  Diaries
                </a>
                <a
                  onClick={navigateToFriends}
                  className="hover:opacity-70 cursor-pointer text-sm"
                >
                  Friends
                </a>
                <a
                  onClick={navigateToEvents}
                  className="hover:opacity-70 cursor-pointer text-sm"
                >
                  Events
                </a>
              </>
            )}
            {isLoggedIn ? (
              <>
                <button
                  onClick={navigateToProfile}
                  className="text-left text-sm hover:opacity-70 transition"
                >
                  👤 Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-sm hover:opacity-70 transition"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <button
                onClick={navigateToLogin}
                className="rounded-full border px-4 py-2 hover:bg-black hover:text-white transition text-sm w-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
