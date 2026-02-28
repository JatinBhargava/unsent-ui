import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { registerUser } from "../services/Auth";

export default function Register() {

   const navigate = useNavigate();
   const navigateToLogin = () => {
     navigate('/login');
   }

   const [form,setForm] = useState({
     email: "",
     username: "",
     displayName: "",
     password: "",
     gender: undefined,
     date_of_birth: "",
   })

   const handleSubmit = (e: React.FormEvent) =>{
     e.preventDefault();
     registerUser(form)
       .then(() => {
         navigateToLogin();
       })
       .catch((error) => {
         console.error("Registration failed:", error);
       });
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-lg text-center">

        {/* Heading */}
        <h1 className="text-4xl font-semibold leading-tight">
          Start a new <span className="italic">diary</span>
        </h1>

        <p className="mt-4 text-gray-600 text-sm max-w-md mx-auto">
          Create a space to write freely.
          Stay anonymous, or let others read and add pages to your diary.
        </p>

        {/* Registration Form */}
        <form className="mt-10 space-y-4 text-left">

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Username
            </label>
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
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Gender + DOB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value === ""? undefined : e.target.value })}
                className="w-full rounded-lg border px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
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
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
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
          <button className="underline hover:text-black transition" onClick={navigateToLogin}>
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