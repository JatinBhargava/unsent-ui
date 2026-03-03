import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function WritePage() {
  const navigate = useNavigate();
  const [page, setPage] = useState({
    title: "",
    content: "",
    tags: "",
    isPublic: true,
  });

  const [charCount, setCharCount] = useState(0);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setPage({ ...page, content });
    setCharCount(content.length);
  };

  const handlePublish = () => {
    if (!page.title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!page.content.trim()) {
      alert("Please write something");
      return;
    }
    console.log("Publishing page:", page);
    // TODO: Send to backend
    alert("Page published successfully!");
    navigate("/diaries");
  };

  const handleSaveDraft = () => {
    if (!page.title.trim()) {
      alert("Please enter a title");
      return;
    }
    console.log("Saving draft:", page);
    // TODO: Send to backend
    alert("Draft saved successfully!");
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
              onChange={(e) => setPage({ ...page, title: e.target.value })}
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
              className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-100 transition"
            >
              Save as Draft
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Publish Page
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
