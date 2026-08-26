import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import AppGallery from "./AppGallery";

/**
 * Specimens of the two things people actually make here. Showing the writing
 * says more than the three adjective tiles that used to sit in this spot.
 */
const letters = [
  {
    excerpt:
      "There is a version of this letter where I actually send it. I keep it here instead.",
    meta: "Diary page · 2:14 a.m.",
    tilt: "sm:-rotate-2",
  },
  {
    excerpt:
      "Told everyone I was fine today. Came home and wrote the true version down.",
    meta: "Diary page · Tuesday",
    tilt: "sm:rotate-1",
  },
  {
    excerpt:
      "Started this for me. Stayed for the strangers who kept writing back.",
    meta: "Diary page · shared",
    tilt: "sm:-rotate-1",
  },
];

const postcards = [
  {
    to: "Ma",
    from: "Aarav",
    excerpt: "The city is loud. I have started calling it home anyway.",
    tilt: "sm:rotate-2",
  },
  {
    to: "You",
    from: "Someone",
    excerpt: "Nothing urgent. Just thinking of you on a Tuesday.",
    tilt: "sm:-rotate-2",
  },
];


const reasons = [
  {
    title: "You decide who reads it",
    body: "Every page carries its own Public or Private toggle. The choice is made per page, not once in a settings screen you forgot about.",
  },
  {
    title: "Stories other people finish",
    body: "Readers can send a continuation to a page you wrote. It stays pending until you accept it, so your diary never changes without you.",
  },
  {
    title: "Writing that leaves the app",
    body: "A postcard arrives in someone's real inbox as a sealed envelope they open in the browser — no account, no app, just the card you wrote.",
  },
  {
    title: "Something small, most days",
    body: "Win of the Day is for the one good thing worth writing down when a whole page feels like too much.",
  },
];

const steps = [
  { step: "01", title: "Write the page", body: "A title, the thing you meant to say, and nothing else in the way." },
  { step: "02", title: "Choose who sees it", body: "Keep it private, or publish it to the diaries anyone can read." },
  { step: "03", title: "Let it be answered", body: "Accept a continuation, message a friend, or post a card to one person." },
];

export default function PaperWall() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="mt-14 w-full max-w-5xl sm:mt-16">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
        What people leave here
      </h2>

      <div className="mt-6 flex flex-wrap items-stretch justify-center gap-4 sm:gap-5">
        {letters.map((letter) => (
          <article
            key={letter.meta}
            className={`group flex w-full max-w-xs flex-1 basis-64 flex-col rounded-2xl border border-white/80 bg-[#fffdf8] p-5 text-left shadow-[0_10px_30px_-18px_rgba(60,45,40,0.55)] transition duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_20px_40px_-20px_rgba(60,45,40,0.6)] ${letter.tilt}`}
          >
            <p className="letter-ruled flex-1 font-serif text-[15px] leading-[28px] text-gray-800">
              {letter.excerpt}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-gray-400">
              {letter.meta}
            </p>
          </article>
        ))}

        {postcards.map((postcard) => (
          <article
            key={postcard.to}
            className={`group flex w-full max-w-xs flex-1 basis-64 flex-col rounded-2xl border border-[#f0e6e1] bg-white p-5 text-left shadow-[0_10px_30px_-18px_rgba(80,45,40,0.5)] transition duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_20px_40px_-20px_rgba(80,45,40,0.55)] ${postcard.tilt}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c9a9a0]">
                  To
                </p>
                <p className="mt-0.5 font-serif text-lg text-[#2f2724]">{postcard.to}</p>
              </div>
              {/* the same wax seal the delivered postcard carries */}
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#c4576b] text-[11px] text-white shadow-[0_6px_14px_-6px_rgba(196,87,107,0.9)]"
              >
                &#9829;
              </span>
            </div>

            <p className="mt-4 flex-1 font-serif text-[15px] leading-[26px] text-gray-800">
              {postcard.excerpt}
            </p>

            <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-[#c9a9a0]">
              Postcard · from {postcard.from}
            </p>
          </article>
        ))}
      </div>

      {/* The postcard feature had no route into it from the landing page at all. */}
      <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-[#f0e6e1] bg-gradient-to-r from-[#f9ece8] to-[#fdf7f3] px-6 py-7 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-serif text-lg text-[#2f2724]">
            Some things belong in someone else&apos;s inbox.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#8c7168]">
            Write a postcard and it lands as a sealed envelope they open in the browser.
          </p>
        </div>
        <button
          onClick={() => navigate(isLoggedIn ? "/postcards" : "/login")}
          className="shrink-0 rounded-full bg-[#2f2724] px-6 py-3 text-sm font-medium text-[#fffdfa] shadow-[0_10px_28px_-12px_rgba(47,39,36,0.9)] transition hover:-translate-y-0.5 hover:bg-[#463a35]"
        >
          Send a postcard
        </button>
      </div>

      {/* ---------- Why this exists ---------- */}
      <div className="mt-20">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          Why write here
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-gray-200/80 bg-white/75 p-6 text-left shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <h3 className="font-serif text-xl text-[#2f2724]">{reason.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-gray-600">{reason.body}</p>
            </div>
          ))}
        </div>
      </div>

      <AppGallery />

      {/* ---------- How it works ---------- */}
      <div className="mt-16">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          How it works
        </h2>

        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-white/80 bg-[#fffdf8] p-6 text-left shadow-[0_10px_30px_-20px_rgba(60,45,40,0.5)]"
            >
              <span className="font-serif text-2xl text-[#e0c8bf]">{item.step}</span>
              <h3 className="mt-2 font-serif text-lg text-[#2f2724]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- Closing ---------- */}
      <div className="mt-16 mb-4 rounded-3xl border border-white/80 bg-white/70 px-6 py-12 text-center shadow-sm backdrop-blur-sm">
        <p className="mx-auto max-w-xl font-serif text-2xl leading-snug text-[#2f2724] sm:text-3xl">
          Not every thought needs a stage. Every honest one deserves a home.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-600">
          Start with one page. Keep it to yourself, or let someone finish it for you.
        </p>
        <button
          onClick={() => navigate(isLoggedIn ? "/write" : "/register")}
          className="mt-7 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.22)]"
        >
          {isLoggedIn ? "Write a page" : "Start writing"}
        </button>
      </div>
    </div>
  );
}
