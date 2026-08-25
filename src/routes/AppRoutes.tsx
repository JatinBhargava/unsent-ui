import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Diaries from "../pages/Dairy";
import DiaryDetail from "../pages/DiaryDetail";
import WinOfTheDay from "../pages/WinOfTheDay";
import WritePage from "../pages/WritePage";
import Profile from "../pages/Profile";
import Events from "../pages/Events";
import Friends from "../pages/Friends";
import Conversation from "../pages/Conversation";
import About from "../pages/About";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import Changelog from "../pages/Changelog";
import RouteMeta from "../components/RouteMeta";
import RouteSpeedInsights from "../components/RouteSpeedInsights";
import { AuthProvider } from "../contexts/AuthContext";
import { Suspense, lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Postcards pulls in MUI + emotion. Lazy so that weight lands only on the
// route that uses it, instead of in every page's bundle.
const Postcards = lazy(() => import("../pages/Postcards"));

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
      window.history.replaceState({}, "", location.pathname);
      navigate("/diaries", { replace: true });
      return;
    }

    if (error) {
      navigate("/", { replace: true });
    }
  }, [location.search, login, navigate]);

  return null;
}

function ProtectedWriteRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <WritePage /> : <Navigate to="/login" replace />;
}

function ProtectedDiariesRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Diaries /> : <Navigate to="/login" replace />;
}

function ProtectedDiaryDetailRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <DiaryDetail /> : <Navigate to="/login" replace />;
}

function ProtectedEventsRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Events /> : <Navigate to="/login" replace />;
}

function ProtectedPostcardsRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Postcards /> : <Navigate to="/login" replace />;
}

function ProtectedConversationRoute() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Conversation /> : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteMeta />
        <RouteSpeedInsights />
        <OAuthCallbackHandler />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-success" element={null} />
            <Route path="/diaries" element={<ProtectedDiariesRoute />} />
            <Route path="/diary/:id" element={<ProtectedDiaryDetailRoute />} />
            <Route path="/write" element={<ProtectedWriteRoute />} />
            <Route path="/postcards" element={<ProtectedPostcardsRoute />} />
            <Route path="/wod" element={<WinOfTheDay />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/events" element={<ProtectedEventsRoute />} />
            <Route path="/friends" element={<Friends />} />
            <Route
              path="/messages/conversation/:id"
              element={<ProtectedConversationRoute />}
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
