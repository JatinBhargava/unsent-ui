import Navbar from "../components/Navbar";

export default function WinOfTheDay() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="w-full max-w-5xl">
        <Navbar />

        {/* Page Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Win of the <span className="italic">Day</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            One page that quietly meant something to many today.
          </p>
        </header>

        {/* WINNER SECTION */}
        <section className="rounded-3xl border border-gray-200/80 bg-[#fffefc] p-6 sm:p-10 mb-10 sm:mb-14 shadow-[0_14px_30px_rgba(17,24,39,0.07)] ring-1 ring-white/80">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-6">
            Today’s highlighted page
          </p>

          <blockquote className="text-xl sm:text-2xl leading-relaxed font-light text-gray-900">
            “I stopped waiting for an apology I was never going to get. That’s
            when things finally felt lighter.”
          </blockquote>

          <div className="mt-8 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200/70 pt-4">
            <span>From an open diary</span>
            <span>Shared quietly · Today</span>
          </div>
        </section>

        {/* MORE MOMENTS */}
        <section>
          <h2 className="text-lg font-medium mb-6 text-gray-800">
            Other moments today
          </h2>

          <div className="grid gap-4 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 sm:p-6 shadow-[0_14px_30px_rgba(17,24,39,0.07)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_24px_55px_rgba(17,24,39,0.14)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-stone-50/70 opacity-70" />
                <p className="relative text-gray-700 text-sm leading-relaxed line-clamp-4">
                  “Some days I write just to prove that I survived them. Today
                  was one of those days.”
                </p>

                <div className="relative mt-4 border-t border-gray-200/70 pt-3 text-xs text-gray-500 flex justify-between">
                  <span>From a diary</span>
                  <span className="transition group-hover:translate-x-0.5">
                    Seen by many
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
