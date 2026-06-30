import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../services/Auth";

export default function Register() {
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };

  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    gender: "" as string | undefined,
    date_of_birth: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    const payload = {
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      ...(form.displayName.trim() && { displayName: form.displayName.trim() }),
      ...(form.gender && { gender: form.gender }),
      ...(form.date_of_birth && { date_of_birth: form.date_of_birth }),
    };
    try {
      await registerUser(payload);
      navigateToLogin();
    } catch (error: unknown) {
      const err = error as Error & { code?: string };
      const msg = err.message?.toLowerCase() ?? "";
      if (msg.includes("email")) {
        setEmailError(err.message || "Invalid email format");
      } else if (msg.includes("password")) {
        setPasswordError(err.message || "Password is required");
      } else {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 sm:px-6">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg text-center">
        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">
          Start a new <span className="italic">diary</span>
        </h1>

        <p className="mt-4 text-gray-600 text-xs sm:text-sm max-w-md mx-auto">
          Create a space to write freely. Stay anonymous, or let others read and
          add pages to your diary.
        </p>

        {/* Registration Form */}
        <form className="mt-10 space-y-4 text-left">
          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-500">Email</label>
              {emailError && (
                <span className="text-xs text-red-500 animate-pulse">{emailError}</span>
              )}
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => { setEmailError(null); setForm({ ...form, email: e.target.value }); }}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${emailError ? "border-red-400 focus:ring-red-400" : "focus:ring-black"}`}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Username</label>
            <input
              type="text"
              placeholder="your-pen-name"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Display name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="What others see"
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-500">Password</label>
              {passwordError && (
                <span className="text-xs text-red-500 animate-pulse">{passwordError}</span>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => { setPasswordError(null); setForm({ ...form, password: e.target.value }); }}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${passwordError ? "border-red-400 focus:ring-red-400" : "focus:ring-black"}`}
            />
          </div>

          {/* Gender + DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gender: e.target.value === "" ? undefined : e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="" disabled>Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Date of birth
              </label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) =>
                  setForm({ ...form, date_of_birth: e.target.value })
                }
                className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-6 rounded-full bg-black text-white px-6 py-3 text-sm hover:opacity-90 transition"
          >
            Create my diary
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          Already have a diary?{" "}
          <button
            className="underline hover:text-black transition"
            onClick={navigateToLogin}
          >
            Open it
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          No followers. No likes. Just writing.
        </p>
      </div>
    </div>
  );
}
