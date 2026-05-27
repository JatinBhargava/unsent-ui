import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDiaryById, type DiaryRecord } from "../services/Diary";

export default function DiaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDiary = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getDiaryById(parseInt(id));
        setDiary(data);
        setError(null);

        // Calculate pages (assuming ~2000 chars per page)
        const pages = Math.ceil((data.content?.length || 0) / 2000);
        setTotalPages(Math.max(1, pages));
        setCurrentPage(1);
      } catch (err) {
        setError("Failed to load diary. Please try again.");
        setDiary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [id]);

  const getPageContent = () => {
    if (!diary?.content) return "";
    const charsPerPage = 2000;
    const start = (currentPage - 1) * charsPerPage;
    const end = start + charsPerPage;
    return diary.content.substring(start, end);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
        <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="w-full max-w-3xl">
          <Navbar />
          <div className="text-center py-12">
            <p className="text-gray-500">Loading diary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !diary) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
        <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="w-full max-w-3xl">
          <Navbar />
          <div className="text-center py-12">
            <p className="text-red-500">{error || "Diary not found"}</p>
            <button
              onClick={() => navigate("/diaries")}
              className="mt-4 inline-block rounded-full bg-gray-900 text-white px-6 py-2 shadow-[0_10px_20px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition font-medium text-sm"
            >
              ← Back to Diaries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="w-full max-w-3xl">
        <Navbar />

        {/* Back Button */}
        <button
          onClick={() => navigate("/diaries")}
          className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/70 px-4 py-2 text-sm text-gray-700 backdrop-blur-sm transition hover:bg-white"
        >
          ← Back to Diaries
        </button>

        {/* Header */}
        <header className="mb-7 sm:mb-10">
          {/* Status Badge */}
          <div className="mb-4">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                diary.status === "Published"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {diary.status}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight tracking-tight text-gray-900">
            {diary.title || `Diary Entry #${diary.recordId}`}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
            <div>
              <span className="font-medium">Visibility:</span>{" "}
              {diary.visibility}
            </div>
            <div>
              <span className="font-medium">Entry ID:</span> #{diary.recordId}
            </div>
            {diary.createdAt && (
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(diary.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <article className="rounded-2xl border border-[#ebe7dc]/60 bg-[#f3f2ee]/95 p-2 sm:p-3 mb-8 sm:mb-12">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm sm:text-base">
            {getPageContent()}
          </div>
        </article>

        {/* Page Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-full font-medium transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.16)]"
              }`}
            >
              ← Previous
            </button>

            <div className="text-center text-sm text-gray-600">
              Page{" "}
              <span className="font-semibold">
                {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-full font-medium transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.16)]"
              }`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Single Page Indicator */}
        {totalPages === 1 && (
          <div className="text-center text-sm text-gray-600">
            <span className="font-semibold">{totalPages} page</span>
          </div>
        )}
      </div>
    </div>
  );
}
