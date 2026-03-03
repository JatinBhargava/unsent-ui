import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateToLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const navigateToDiaries = () => {
    navigate("/diaries");
    setMenuOpen(false);
  };

  const navigateToWinOfTheDay = () => {
    navigate("/wod");
    setMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
        Unsent
      </h1>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
        <a
          onClick={navigateToWinOfTheDay}
          className="hover:opacity-70 cursor-pointer"
        >
          Win of the Day
        </a>
        <a
          onClick={navigateToDiaries}
          className="hover:opacity-70 cursor-pointer"
        >
          Diaries
        </a>
        <a href="#features" className="hover:opacity-70">
          Friends
        </a>
        <a href="#community" className="hover:opacity-70">
          Events
        </a>
        <button
          onClick={navigateToLogin}
          className="rounded-full border px-4 py-1.5 hover:bg-black hover:text-white transition"
        >
          Login
        </button>
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
            <a
              onClick={navigateToWinOfTheDay}
              className="hover:opacity-70 cursor-pointer text-sm"
            >
              Win of the Day
            </a>
            <a
              onClick={navigateToDiaries}
              className="hover:opacity-70 cursor-pointer text-sm"
            >
              Diaries
            </a>
            <a href="#features" className="hover:opacity-70 text-sm">
              Friends
            </a>
            <a href="#community" className="hover:opacity-70 text-sm">
              Events
            </a>
            <button
              onClick={navigateToLogin}
              className="rounded-full border px-4 py-2 hover:bg-black hover:text-white transition text-sm w-full"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
