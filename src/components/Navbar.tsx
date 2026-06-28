import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigateToLogin = () => { navigate("/login"); setMenuOpen(false); };
  const navigateToProfile = () => { navigate("/profile"); setUserDropdownOpen(false); };
  const navigateToDiaries = () => { navigate("/diaries"); setMenuOpen(false); };
  const navigateToWinOfTheDay = () => { navigate("/wod"); setMenuOpen(false); };
  const navigateToWrite = () => { navigate("/write"); setMenuOpen(false); };
  const navigateToEvents = () => { navigate("/events"); setMenuOpen(false); };
  const navigateToFriends = () => { navigate("/friends"); setMenuOpen(false); };
  const navigateToHome = () => { navigate("/"); setMenuOpen(false); };
  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); setUserDropdownOpen(false); };

  return (
    <nav className="flex items-center justify-between py-2 text-gray-900">
      <h1
        onClick={navigateToHome}
        className="text-base font-semibold tracking-tight cursor-pointer hover:opacity-60 transition select-none"
      >
        Unsent
      </h1>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-5 md:gap-7 text-[13px] text-gray-600">
        {!isLoggedIn && (
          <a onClick={navigateToWinOfTheDay} className="hover:text-gray-900 cursor-pointer transition">
            Win of the Day
          </a>
        )}
        {isLoggedIn && (
          <>
            <a onClick={navigateToWrite} className="hover:text-gray-900 cursor-pointer transition font-medium text-gray-900">
              Write
            </a>
            <a onClick={navigateToDiaries} className="hover:text-gray-900 cursor-pointer transition">Diaries</a>
            <a onClick={navigateToFriends} className="hover:text-gray-900 cursor-pointer transition">Friends</a>
            <a onClick={navigateToEvents} className="hover:text-gray-900 cursor-pointer transition">Events</a>
          </>
        )}

        {isLoggedIn ? (
          <div className="relative">
            <button
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 hover:bg-gray-300 transition text-xs font-semibold text-gray-700"
              title="User Menu"
            >
              U
            </button>
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1 bg-white/90 backdrop-blur-md border border-gray-100 rounded-xl shadow-xl z-50 min-w-[140px] overflow-hidden"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button
                  onClick={navigateToProfile}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition border-t border-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={navigateToLogin}
            className="rounded-full border border-gray-300 px-4 py-1.5 text-xs hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden flex flex-col gap-[5px] cursor-pointer p-1"
        title="Menu"
      >
        <span className={`block w-5 h-px bg-gray-700 transition-all ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
        <span className={`block w-5 h-px bg-gray-700 transition-all ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-px bg-gray-700 transition-all ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#f3f2ee]/95 backdrop-blur-md sm:hidden z-50">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm text-gray-700">
            {!isLoggedIn && (
              <a onClick={navigateToWinOfTheDay} className="hover:text-gray-900 cursor-pointer">Win of the Day</a>
            )}
            {isLoggedIn && (
              <>
                <a onClick={navigateToWrite} className="font-medium text-gray-900 cursor-pointer">Write</a>
                <a onClick={navigateToDiaries} className="hover:text-gray-900 cursor-pointer">Diaries</a>
                <a onClick={navigateToFriends} className="hover:text-gray-900 cursor-pointer">Friends</a>
                <a onClick={navigateToEvents} className="hover:text-gray-900 cursor-pointer">Events</a>
                <hr className="border-gray-100" />
                <button onClick={navigateToProfile} className="text-left hover:text-gray-900 transition">Profile</button>
                <button onClick={handleLogout} className="text-left text-red-500 hover:text-red-700 transition">Logout</button>
              </>
            )}
            {!isLoggedIn && (
              <button onClick={navigateToLogin} className="rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-900 hover:text-white transition">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
