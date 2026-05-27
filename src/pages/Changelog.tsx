import Navbar from "../components/Navbar";
import { useState } from "react";

const changelog = [
  {
    version: "v1.4.0",
    date: "May 2026",
    highlights: [
      "Added Friends MVP with request flow, list, chat panel, and voice-call UI.",
      "Added Events page with event posting, interested count, share support, and QR pay generation.",
      "Added About, Terms, and Privacy legal/info pages with footer mapping.",
    ],
  },
  {
    version: "v1.3.0",
    date: "May 2026",
    highlights: [
      "Redesigned Diaries and Diary Detail pages with a modern classy card system.",
      "Improved responsive grid behavior across different screen sizes.",
      "Refined Home hero and typography to match premium visual language.",
    ],
  },
  {
    version: "v1.2.0",
    date: "May 2026",
    highlights: [
      "Added profile editing flow with one-time update lock for DOB and gender.",
      "Enabled display name updates with save state and error handling.",
      "Improved profile aesthetics for better readability and consistency.",
    ],
  },
  {
    version: "v1.1.0",
    date: "April 2026",
    highlights: [
      "Added diary writing flow with publish and draft support.",
      "Implemented diary listing and detail navigation.",
      "Introduced authentication-backed route access flow.",
    ],
  },
  {
    version: "v1.0.0",
    date: "March 2026",
    highlights: [
      "Initial release of Unsent UI with core auth and landing experience.",
      "Base infrastructure with React, TypeScript, Vite, and Tailwind.",
      "Foundation for API integration and future product modules.",
    ],
  },
];

export default function Changelog() {
  const [openVersion, setOpenVersion] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-rose-200/55 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-[-4rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="w-full max-w-4xl">
        <Navbar />

        <header className="mb-10 sm:mb-14 text-left">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Open Source{" "}
            <span className="italic bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-500 bg-clip-text text-transparent">
              Changelog
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-700 text-xs sm:text-sm max-w-2xl leading-relaxed">
            A version-wise record of features, updates, improvements, and
            release milestones for this project.
          </p>
        </header>

        <main className="pb-10 space-y-7">
          {changelog.map((release) => (
            <section key={release.version} className="border-l-2 border-gray-300/80 pl-4 sm:pl-5">
              <button
                type="button"
                onClick={() =>
                  setOpenVersion((prev) =>
                    prev === release.version ? null : release.version
                  )
                }
                className="w-full flex items-center justify-between gap-3 text-left"
              >
                <p className="text-sm sm:text-base text-gray-900">
                  <span className="font-semibold">{release.version}</span> ({release.date}) - click to view full update details
                </p>
                <span className="text-xs text-gray-600">
                  {openVersion === release.version ? "Hide" : "Show"}
                </span>
              </button>

              {openVersion === release.version && (
                <ul className="mt-4 space-y-2 text-sm sm:text-base text-gray-800">
                  {release.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-rose-500 to-cyan-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
