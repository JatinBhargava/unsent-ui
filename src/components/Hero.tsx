export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center mt-24 px-6">
      <h1 className="text-5xl font-semibold leading-tight max-w-4xl">
        Write what you never meant to send.
        <br />
        <span className="italic text-gray-700">
          Let others read — or write alongside you.
        </span>
      </h1>

      <p className="mt-6 text-gray-600 max-w-2xl text-lg">
        Unsent is a shared diary for people who love to write.  
        Keep your pages personal, or invite others to read and add their own —
        like a quiet blog written together, one diary page at a time.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button className="rounded-full bg-black text-white px-7 py-3 text-sm font-medium hover:opacity-90 transition">
          Start Writing
        </button>
        <button className="rounded-full border border-gray-300 px-7 py-3 text-sm font-medium hover:bg-gray-100 transition">
          Read Diaries
        </button>
      </div>
    </section>
  );
}