import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Diaries() {
  const navigate = useNavigate();

  const openDiary = (id: number) => {
    navigate(`/diary/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
      <div className="w-full max-w-5xl">
        <Navbar />

        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            Public <span className="italic">Diaries</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2">
            These are notebooks left open. Read quietly. Add a page if it speaks
            to you.
          </p>
        </header>

        {/* Diary List */}
        <section className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="bg-white border rounded-2xl p-4 sm:p-6 hover:shadow-sm transition cursor-pointer"
              onClick={() => openDiary(id)}
            >
              {/* Diary Title */}
              <h2 className="text-lg sm:text-xl font-medium leading-snug">
                Pages I never meant to send
              </h2>

              {/* Preview */}
              <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
                I keep writing letters in my head — to people I no longer talk
                to, to versions of myself I don’t recognize anymore. This diary
                is where they end up.
              </p>

              {/* Meta */}
              <div className="mt-4 sm:mt-6 flex justify-between items-center text-xs text-gray-400">
                <span>12 pages</span>
                <span>Last written · 3 days ago</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
