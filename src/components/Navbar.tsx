import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const [mobileMenuTop, setMobileMenuTop] = useState(0);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!userDropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (
        !avatarBtnRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [userDropdownOpen]);

  const openDropdown = () => {
    if (avatarBtnRef.current) {
      const r = avatarBtnRef.current.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    setUserDropdownOpen((o) => !o);
  };

  const openMobileMenu = () => {
    if (navRef.current) {
      const r = navRef.current.getBoundingClientRect();
      setMobileMenuTop(r.bottom);
    }
    setMenuOpen((o) => !o);
  };

  const navigateToLogin    = () => { navigate("/login");    setMenuOpen(false); };
  const navigateToProfile  = () => { navigate("/profile");  setMenuOpen(false); setUserDropdownOpen(false); };
  const navigateToDiaries  = () => { navigate("/diaries");  setMenuOpen(false); };
  const navigateToWinOfTheDay = () => { navigate("/wod");   setMenuOpen(false); };
  const navigateToWrite    = () => { navigate("/write");    setMenuOpen(false); };
  const navigateToEvents   = () => { navigate("/events");   setMenuOpen(false); };
  const navigateToFriends  = () => { navigate("/friends");  setMenuOpen(false); };
  const navigateToHome     = () => { navigate("/");         setMenuOpen(false); };
  const handleLogout       = () => { logout(); navigate("/"); setMenuOpen(false); setUserDropdownOpen(false); };

  return (
    <nav ref={navRef} className="flex items-center justify-between py-2 text-gray-900">
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
            <a onClick={navigateToWrite} className="hover:text-gray-900 cursor-pointer transition font-medium text-gray-900">Write</a>
            <a onClick={navigateToDiaries} className="hover:text-gray-900 cursor-pointer transition">Diaries</a>
            <a onClick={navigateToFriends} className="hover:text-gray-900 cursor-pointer transition">Friends</a>
            <a onClick={navigateToEvents} className="hover:text-gray-900 cursor-pointer transition">Events</a>
          </>
        )}

        {isLoggedIn ? (
          <div className="relative">
            <button
              ref={avatarBtnRef}
              onClick={openDropdown}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 hover:bg-gray-300 transition text-xs font-semibold text-gray-700"
              title="User Menu"
            >
              U
            </button>
            {userDropdownOpen && createPortal(
              <div
                ref={dropdownRef}
                style={{ top: dropdownPos.top, right: dropdownPos.right }}
                className="fixed bg-white border border-gray-100 rounded-xl shadow-lg z-[9999] min-w-[140px] overflow-hidden"
              >
                <button onClick={navigateToProfile} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                  Profile
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition border-t border-gray-100">
                  Logout
                </button>
              </div>,
              document.body
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
        onClick={openMobileMenu}
        className="sm:hidden flex flex-col gap-[5px] cursor-pointer p-1"
        title="Menu"
      >
        <span className={`block w-5 h-px bg-gray-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
        <span className={`block w-5 h-px bg-gray-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-px bg-gray-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
      </button>

      {/* Mobile Menu — portaled to escape stacking contexts */}
      {menuOpen && createPortal(
        <div
          style={{ top: mobileMenuTop }}
          className="fixed left-0 right-0 bottom-0 z-[9999] flex flex-col"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          {/* Panel */}
          <div className="relative bg-[#f3f2ee]/98 backdrop-blur-md border-t border-gray-200/60 shadow-xl">
            <div className="flex flex-col px-6 py-5 gap-1">
              {!isLoggedIn && (
                <button onClick={navigateToWinOfTheDay} className="text-left py-3 text-sm text-gray-700 hover:text-gray-900 border-b border-gray-100 transition">
                  Win of the Day
                </button>
              )}
              {isLoggedIn && (
                <>
                  <button onClick={navigateToWrite} className="text-left py-3 text-sm font-medium text-gray-900 border-b border-gray-100">Write</button>
                  <button onClick={navigateToDiaries} className="text-left py-3 text-sm text-gray-700 hover:text-gray-900 border-b border-gray-100 transition">Diaries</button>
                  <button onClick={navigateToFriends} className="text-left py-3 text-sm text-gray-700 hover:text-gray-900 border-b border-gray-100 transition">Friends</button>
                  <button onClick={navigateToEvents} className="text-left py-3 text-sm text-gray-700 hover:text-gray-900 border-b border-gray-100 transition">Events</button>
                  <button onClick={navigateToProfile} className="text-left py-3 text-sm text-gray-700 hover:text-gray-900 border-b border-gray-100 transition">Profile</button>
                  <button onClick={handleLogout} className="text-left py-3 text-sm text-red-500 hover:text-red-700 transition">Logout</button>
                </>
              )}
              {!isLoggedIn && (
                <button onClick={navigateToLogin} className="mt-2 rounded-full bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-black transition">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
