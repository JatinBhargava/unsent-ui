import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "../services/Auth";
import { useAuth } from "../contexts/AuthContext";
import { getOauthBaseUrl } from "../config/api";
import googleIcon from "../assets/google.png";
import githubIcon from "../assets/github.png";

const OAUTH_BASE_URL = getOauthBaseUrl();

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const navigateToRegistration = () => {
    navigate("/register");
  };

  const navigateToDiaries = () => {
    navigate("/diaries");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const oauthToken = searchParams.get("token");
    if (!oauthToken) {
      return;
    }

    login(oauthToken);
    navigate("/diaries", { replace: true });
  }, [searchParams, login, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(form)
      .then((response) => {
        // Store the token from the response
        const token = response.token || response.accessToken;
        login(token);
        navigateToDiaries();
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 sm:px-6">
      <div className="w-full max-w-xs sm:max-w-md text-center">
        {/* Back to Home Button */}
        <button
          onClick={navigateToHome}
          className="mb-6 text-xs sm:text-sm text-gray-600 hover:text-black underline transition"
        >
          ← Back to Home
        </button>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">
          Open your <span className="italic">diary</span>
        </h1>

        <p className="mt-4 text-gray-600 text-xs sm:text-sm">
          A space for people who love to write. Read others. Add a page. Or keep
          it just yours.
        </p>

        {/* OAuth */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              window.location.href = `${OAUTH_BASE_URL}/oauth2/authorization/google?prompt=select_account`;
            }}
            className="w-full flex items-center justify-center gap-3 rounded-full border px-5 py-3 text-sm hover:bg-gray-100 transition"
          >
            <img src={googleIcon} alt="Google" className="h-4 w-4" />
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 rounded-full border px-5 py-3 text-sm hover:bg-gray-100 transition">
            <img src={githubIcon} alt="GitHub" className="h-4 w-4" />
            Continue with GitHub (soon)
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-xs text-gray-400">or open with words</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login Form */}
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              placeholder="yourname"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            onClick={handleLogin}
            className="w-full mt-2 rounded-full bg-black text-white px-6 py-3 text-sm hover:opacity-90 transition"
          >
            Open diary
          </button>
        </form>

        {/* Footer actions */}
        <div className="mt-8 text-sm text-gray-500">
          New here?{" "}
          <button
            className="underline hover:text-black transition"
            onClick={navigateToRegistration}
          >
            Start a new diary
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          No profiles. No noise. Just pages and people.
        </p>
      </div>
    </div>
  );
}
