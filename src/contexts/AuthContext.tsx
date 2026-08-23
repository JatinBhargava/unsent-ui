import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT and extract userId, email, and expiry
function decodeToken(
  token: string,
): { userId?: string; id?: string; sub?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    return null;
  }
}

// setTimeout's delay is a 32-bit signed int internally; anything longer just
// never fires. Cap it so a far-future exp doesn't silently skip scheduling.
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("authToken"),
  );
  const [userId, setUserId] = useState<string | null>(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const decoded = decodeToken(token);
    return (decoded?.userId || decoded?.id || null) as string | null;
  });
  const [email, setEmail] = useState<string | null>(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const decoded = decodeToken(token);
    return (decoded?.sub || null) as string | null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken"),
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (!tokenFromUrl) {
      return;
    }

    const decoded = decodeToken(tokenFromUrl);
    const extractedUserId = decoded?.userId || decoded?.id || null;
    const extractedEmail = decoded?.sub || null;

    localStorage.setItem("authToken", tokenFromUrl);
    setToken(tokenFromUrl);
    setIsLoggedIn(true);
    setUserId(extractedUserId);
    setEmail(extractedEmail);
    window.location.replace("/diaries");
  }, []);

  const login = (loginToken: string) => {
    const decoded = decodeToken(loginToken);
    const extractedUserId = decoded?.userId || decoded?.id || null;
    const extractedEmail = decoded?.sub || null;

    localStorage.setItem("authToken", loginToken);
    setToken(loginToken);
    setIsLoggedIn(true);
    setUserId(extractedUserId);
    setEmail(extractedEmail);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    setIsLoggedIn(false);
    setUserId(null);
    setEmail(null);
  }, []);

  // Auto-logout once the JWT's own expiry is reached, so a stale token
  // doesn't leave the UI showing "logged in" after it's no longer valid.
  useEffect(() => {
    if (!token) return;

    const exp = decodeToken(token)?.exp;
    if (!exp) return;

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }

    const timeoutId = window.setTimeout(logout, Math.min(msUntilExpiry, MAX_TIMEOUT_MS));
    return () => window.clearTimeout(timeoutId);
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, email, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
