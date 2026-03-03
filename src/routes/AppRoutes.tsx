import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Diaries from "../pages/Dairy";
import WinOfTheDay from "../pages/WinOfTheDay";
import WritePage from "../pages/WritePage";
import { AuthProvider } from "../contexts/AuthContext";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/diaries" element={<Diaries />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/wod" element={<WinOfTheDay />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
