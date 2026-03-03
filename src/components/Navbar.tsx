import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToDiaries = () => {
    navigate("/diaries");
  };

  const navigateToWinOfTheDay = () => {
    navigate("/wod");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-10 py-6">
      <h1 className="text-xl font-semibold tracking-tight">Unsent</h1>

      <div className="flex items-center gap-6 text-sm">
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
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-lg cursor-pointer hover:opacity-70 transition"
            title="Logout"
          >
            🚪
          </button>
        ) : (
          <button
            onClick={navigateToLogin}
            className="rounded-full border px-4 py-1.5 hover:bg-black hover:text-white transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
