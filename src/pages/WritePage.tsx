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

  // Fetch user ID from email if not available in context
  useEffect(() => {
    if (userId || !email) return;

    const fetchUserId = async () => {
      try {
        const user = await getUserByEmail(email);
        setUserId(user.userId); // Use user.id if available, otherwise use email
      } catch (error) {
        // Fallback to using email as userId
        setUserId(email);
      }
    };

    fetchUserId();
  }, [email, userId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPage({ ...page, title });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPage({ ...page, content });
    setCharCount(content.length);
  };

  const handlePublish = async () => {
    if (!page.title.trim()) {
      showNotification("error","Please enter a title");
      return;
    }
    if (!page.content.trim()) {
      showNotification("error","Please write something");
      return;
    }
    if (!userId) {
      showNotification("error","User ID not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      await createDiaryEntry({
        userId,
        title: page.title,
        content: page.content,
        visibility: page.isPublic ? "Public" : "Private",
        status: "Published",
      });
      showNotification("error","Page published successfully!");
      navigate("/diaries");
    } catch (error) {
      console.error("Error publishing page:", error);
      showNotification("error","Failed to publish page. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!page.title.trim()) {
      showNotification("error","Please enter a title");
      return;
    }
    if (!userId) {
      showNotification("error","User ID not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      await createDiaryEntry({
        userId,
        content: page.content,
        visibility: page.isPublic ? "Public" : "Private",
        status: "Draft",
      });
      showNotification("success","Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      showNotification("error","Failed to save draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/diaries")}
            className="text-xs sm:text-sm text-gray-600 hover:text-black underline transition mb-4"
          >
            ← Back to Diaries
          </button>
          <h1 className="text-2xl sm:text-4xl font-semibold">
            Write a New Page
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Share your thoughts. Keep it private or let others read.
          </p>
        </div>

        {/* Write Form */}
        <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-500 font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Give your page a title..."
              value={page.title}
              onChange={handleTitleChange}
              className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-500 font-medium mb-2">
              Content * ({charCount} characters)
            </label>
            <textarea
              placeholder="Write your thoughts here..."
              value={page.content}
              onChange={handleContentChange}
              rows={12}
              className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs sm:text-sm text-gray-500 font-medium mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., thoughts, memories, poetry (comma separated)"
              value={page.tags}
              onChange={(e) => setPage({ ...page, tags: e.target.value })}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs sm:text-sm text-gray-700 font-medium">
                Visibility
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {page.isPublic
                  ? "Anyone can read this page"
                  : "Only you can read this page"}
              </p>
            </div>
            <button
              onClick={() => setPage({ ...page, isPublic: !page.isPublic })}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                page.isPublic ? "bg-black" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                  page.isPublic ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex-1 rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Publishing..." : "Publish Page"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-500">
          <p>
            Your page will be saved to your diary and can be edited anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
