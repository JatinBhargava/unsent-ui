import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center px-4 text-center sm:mt-14 sm:px-6 md:mt-20">
      <span className="mb-5 rounded-full border border-gray-300/80 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-600 shadow-sm backdrop-blur-sm sm:text-xs">
        A Shared Space For Quiet Writing
      </span>

      <h1 className="max-w-4xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
        Write what you never meant to send.
        <span className="italic text-gray-700 md:ml-2">
          Let others read — or write alongside you.
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mt-6 sm:text-base md:text-lg">
        Unsent is a shared diary for people who love to write. Keep your pages
        personal, or invite others to read and add their own — like a quiet blog
        written together, one diary page at a time.
      </p>

      <div className="mt-9 flex flex-col gap-4 sm:mt-10 sm:flex-row">
        <button
          onClick={() => navigate(isLoggedIn ? "/diaries" : "/login")}
          className="rounded-full bg-gray-900 px-7 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.22)]"
        >
          {isLoggedIn ? "Go to Diaries" : "Start Writing"}
        </button>
        <button
          onClick={() => navigate("/diaries")}
          className="rounded-full border border-gray-300 bg-white/70 px-7 py-3 text-sm font-medium backdrop-blur-sm transition hover:bg-white"
        >
          Read Diaries
        </button>
      </div>

      <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/80 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Mood</p>
          <p className="mt-1 text-sm font-medium text-gray-800">Quiet and honest writing</p>
        </div>
        <div className="rounded-2xl border border-gray-200/80 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Style</p>
          <p className="mt-1 text-sm font-medium text-gray-800">Minimal, warm, and personal</p>
        </div>
        <div className="rounded-2xl border border-gray-200/80 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500">Flow</p>
          <p className="mt-1 text-sm font-medium text-gray-800">Write, publish, read together</p>
        </div>
      </div>
    </section>
  );
}
