import { useNavigate } from "react-router-dom";

export default function Diaries() {
  const navigate = useNavigate();

  const openDiary = (id: number) => {
    navigate(`/diary/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] px-6 py-12 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-semibold">
            Public <span className="italic">Diaries</span>
          </h1>
          <p className="mt-4 text-gray-600 text-sm max-w-2xl mx-auto">
            These are notebooks left open.
            Read quietly. Add a page if it speaks to you.
          </p>
        </header>

        {/* Diary List */}
        <section className="grid gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="bg-white border rounded-2xl p-6 hover:shadow-sm transition cursor-pointer"
              onClick={() => openDiary(id)}
            >
              {/* Diary Title */}
              <h2 className="text-xl font-medium leading-snug">
                Pages I never meant to send
              </h2>

              {/* Preview */}
              <p className="mt-4 text-gray-600 text-sm leading-relaxed line-clamp-4">
                I keep writing letters in my head — to people I no longer talk to,
                to versions of myself I don’t recognize anymore. This diary is where
                they end up.
              </p>

              {/* Meta */}
              <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
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