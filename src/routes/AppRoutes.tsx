import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Diaries from "../pages/Dairy";
import WinOfTheDay from "../pages/WinOfTheDay";
import WritePage from "../pages/WritePage";
import { AuthProvider } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function OAuthCallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      login(token);
      navigate("/diaries", { replace: true });
      return;
    }

    if (error) {
      navigate("/", { replace: true });
    }
  }, [location.search, login, navigate]);

  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OAuthCallbackHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-success" element={null} />
          <Route path="/diaries" element={<Diaries />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/wod" element={<WinOfTheDay />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
