import Navbar from "../components/Navbar";

export default function Events() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
          <Navbar />
        </div>

        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 mb-6">
            Coming soon
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Community <span className="italic text-amber-700/80">Events</span>
          </h1>
          <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-sm leading-relaxed">
            A space to discover and share writing meetups, journaling circles, and community gatherings. We’re building this now.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
            {["Meetups", "Journaling circles", "Open mics", "Community calls"].map((tag) => (
              <span key={tag} className="rounded-full border border-gray-200 bg-white/60 px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
