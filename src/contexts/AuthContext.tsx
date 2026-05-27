import {
  createContext,
  useState,
  useContext,
  useEffect,
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

// Helper function to decode JWT and extract userId and email
function decodeToken(
  token: string,
): { userId?: string; id?: string; sub?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    return null;
  }
}

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

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setIsLoggedIn(false);
    setUserId(null);
    setEmail(null);
  };

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
