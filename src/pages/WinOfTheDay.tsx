import Navbar from "../components/Navbar";

export default function WinOfTheDay() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-14 flex justify-center">
      <div className="w-full max-w-4xl">
        <Navbar />

        {/* Page Header */}
        <header className="text-center mb-14">
          <h1 className="text-4xl font-semibold">
            Win of the <span className="italic">Day</span>
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-xl mx-auto">
            One page that quietly meant something to many today.
          </p>
        </header>

        {/* WINNER SECTION */}
        <section className="bg-white border rounded-3xl p-10 mb-16">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-6">
            Today’s highlighted page
          </p>

          <blockquote className="text-2xl leading-relaxed font-light text-gray-900">
            “I stopped waiting for an apology I was never going to get. That’s
            when things finally felt lighter.”
          </blockquote>

          <div className="mt-8 flex justify-between items-center text-xs text-gray-400">
            <span>From an open diary</span>
            <span>Shared quietly · Today</span>
          </div>
        </section>

        {/* MORE MOMENTS */}
        <section>
          <h2 className="text-lg font-medium mb-6">Other moments today</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border rounded-2xl p-6 hover:shadow-sm transition"
              >
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  “Some days I write just to prove that I survived them. Today
                  was one of those days.”
                </p>

                <div className="mt-4 text-xs text-gray-400 flex justify-between">
                  <span>From a diary</span>
                  <span>Seen by many</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
