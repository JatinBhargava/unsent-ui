import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createDiaryEntry } from "../services/Diary";
import { getUserByEmail } from "../services/Auth";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../hooks/useNotification";

export default function WritePage() {
  const navigate = useNavigate();
  const { userId: contextUserId, email } = useAuth();
  const { showNotification, NotificationComponent } = useNotification();
  const [userId, setUserId] = useState<string | null>(contextUserId);
  const [page, setPage] = useState({
    title: "",
    content: "",
    tags: "",
    isPublic: true,
  });

  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId || !email) return;
    const fetchUserId = async () => {
      try {
        const user = await getUserByEmail(email);
        setUserId(user.userId);
      } catch {
        setUserId(email);
      }
    };
    fetchUserId();
  }, [email, userId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage({ ...page, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPage({ ...page, content: e.target.value });
    setCharCount(e.target.value.length);
  };

  const handlePublish = async () => {
    if (!page.title.trim()) { showNotification("error", "Please enter a title"); return; }
    if (!page.content.trim()) { showNotification("error", "Please write something"); return; }
    if (!userId) { showNotification("error", "User ID not found. Please log in again."); return; }
    setIsLoading(true);
    try {
      await createDiaryEntry({
        userId,
        title: page.title,
        content: page.content,
        visibility: page.isPublic ? "Public" : "Private",
        status: "Published",
      });
      showNotification("success", "Page published successfully!");
      navigate("/diaries");
    } catch {
      showNotification("error", "Failed to publish page. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!page.title.trim()) { showNotification("error", "Please enter a title"); return; }
    if (!userId) { showNotification("error", "User ID not found. Please log in again."); return; }
    setIsLoading(true);
    try {
      await createDiaryEntry({
        userId,
        content: page.content,
        visibility: page.isPublic ? "Public" : "Private",
        status: "Draft",
      });
      showNotification("success", "Draft saved successfully!");
    } catch {
      showNotification("error", "Failed to save draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-rose-100/20 blur-3xl" />

      <NotificationComponent />

      <div className="relative z-10 w-full max-w-2xl">
        <Navbar />

        {/* Hero */}
        <div className="mt-8 mb-10 text-center">
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">New entry</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            What's on your mind?
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Write freely. Keep it for yourself or share it with the world.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6">

          {/* Title */}
          <input
            type="text"
            placeholder="Give it a title…"
            value={page.title}
            onChange={handleTitleChange}
            className="w-full bg-transparent border-0 border-b border-gray-200 px-0 py-2 text-lg sm:text-xl font-medium text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition"
          />

          {/* Content */}
          <textarea
            placeholder="Start writing here…"
            value={page.content}
            onChange={handleContentChange}
            rows={14}
            className="w-full bg-transparent border-0 resize-none text-sm sm:text-base text-gray-700 placeholder:text-gray-300 leading-relaxed focus:outline-none"
          />

          {/* Footer row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">

            {/* Visibility + char count */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage({ ...page, isPublic: !page.isPublic })}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800 transition"
              >
                <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${page.isPublic ? "bg-gray-900" : "bg-gray-300"}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${page.isPublic ? "translate-x-4" : "translate-x-1"}`} />
                </span>
                {page.isPublic ? "Public" : "Private"}
              </button>
              {charCount > 0 && (
                <span className="text-xs text-gray-400">{charCount} chars</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="flex-1 sm:flex-none rounded-full border border-gray-300 px-5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                {isLoading ? "Saving…" : "Save draft"}
              </button>
              <button
                onClick={handlePublish}
                disabled={isLoading}
                className="flex-1 sm:flex-none rounded-full bg-gray-900 text-white px-5 py-2 text-xs font-medium hover:opacity-90 transition disabled:opacity-50 shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
              >
                {isLoading ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 px-1">
          <input
            type="text"
            placeholder="Add tags: thoughts, memories, poetry…"
            value={page.tags}
            onChange={(e) => setPage({ ...page, tags: e.target.value })}
            className="w-full bg-transparent text-xs text-gray-400 placeholder:text-gray-300 focus:outline-none focus:text-gray-600 transition"
          />
        </div>
      </div>
    </div>
  );
}
