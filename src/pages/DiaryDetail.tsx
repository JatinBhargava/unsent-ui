import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNotification } from "../hooks/useNotification";
import { useAuth } from "../contexts/AuthContext";
import { getUserByEmail } from "../services/Auth";
import {
  getDiaryById,
  updateDiaryEntry,
  deleteDiaryEntry,
  type DiaryRecord,
} from "../services/Diary";

export default function DiaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification, NotificationComponent } = useNotification();
  const { userId: authUserId, email } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(authUserId);
  const [diary, setDiary] = useState<DiaryRecord | null>(null);

  useEffect(() => {
    if (authUserId) {
      setCurrentUserId(authUserId);
    } else if (email) {
      getUserByEmail(email)
        .then((user) => setCurrentUserId(String(user.id || user.userId || "")))
        .catch(() => {});
    }
  }, [authUserId, email]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editVisibility, setEditVisibility] = useState("Public");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleEditClick = () => {
    if (diary) {
      setEditTitle(diary.title || "");
      setEditContent(diary.content || "");
      setEditVisibility(diary.visibility || "Public");
      setEditStatus(diary.status || "ACTIVE");
      setIsEditMode(true);
      setMenuOpen(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!diary) return;

    try {
      setIsSaving(true);
      await updateDiaryEntry(diary.recordId, {
        title: editTitle,
        content: editContent,
        visibility: editVisibility,
        status: editStatus,
      });

      // Update the local diary state
      setDiary({
        ...diary,
        title: editTitle,
        content: editContent,
        visibility: editVisibility as "Public" | "Private",
        status: editStatus,
      });

      setIsEditMode(false);
      // Reset pagination after content update
      const pages = Math.ceil(editContent.length / 2000);
      setTotalPages(Math.max(1, pages));
      setCurrentPage(1);
      showNotification("success", "Changes saved successfully!");
    } catch (err) {
      console.error("Failed to update diary:", err);
      showNotification("error", "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!diary) return;

    try {
      setIsDeleting(true);
      await deleteDiaryEntry(diary.recordId);
      showNotification("success", "Diary entry deleted successfully!");
      // Delay navigation to let user see the success message
      setTimeout(() => {
        navigate("/diaries");
      }, 1000);
    } catch (err) {
      console.error("Failed to delete diary:", err);
      showNotification(
        "error",
        "Failed to delete diary entry. Please try again.",
      );
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
        <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="relative z-10 w-full max-w-3xl">
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
        <div className="relative z-10 w-full max-w-3xl">
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

      {/* Notification Toast */}
      <NotificationComponent />

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
        <header className="mb-7 sm:mb-10 relative">
          {/* Instagram-style Menu — only visible to the owner */}
          {currentUserId && String(diary.userId) === String(currentUserId) && (
          <div className="absolute top-0 right-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition"
              title="More options"
            >
              <span className="text-2xl">⋯</span>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-white/90 backdrop-blur-md rounded-lg shadow-xl border border-white/40 overflow-hidden z-50 min-w-[200px]">
                <button
                  onClick={handleEditClick}
                  className="w-full px-4 py-3 text-left text-gray-800 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-transparent hover:border-l-2 hover:border-blue-400 transition font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-gradient-to-r hover:from-red-50/60 hover:to-transparent hover:border-l-2 hover:border-red-400 transition font-medium text-sm border-t border-gray-200/50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          )}

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
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight tracking-tight text-gray-900 pr-24">
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
        {/* Content - View Mode */}
        {!isEditMode && (
          <>
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
          </>
        )}

        {/* Content - Edit Mode */}
        {isEditMode && (
          <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 mb-10">
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm text-gray-500 font-medium mb-2">
                Title *
              </label>

              <input
                type="text"
                placeholder="Give your page a title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs sm:text-sm text-gray-500 font-medium mb-2">
                Content * ({editContent.length} characters)
              </label>

              <textarea
                placeholder="Write your thoughts here..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={16}
                className="w-full rounded-lg border px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-xs sm:text-sm text-gray-700 font-medium">
                  Visibility
                </label>

                <p className="text-xs text-gray-500 mt-1">
                  {editVisibility === "Public"
                    ? "Anyone can read this page"
                    : "Only you can read this page"}
                </p>
              </div>

              <button
                onClick={() =>
                  setEditVisibility(
                    editVisibility === "Public" ? "Private" : "Public",
                  )
                }
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  editVisibility === "Public" ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    editVisibility === "Public"
                      ? "translate-x-7"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex-1 rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Delete Diary Entry?
                </h2>
                <p className="text-gray-600 mb-8">
                  Are you sure you want to delete this entry? This action cannot
                  be undone.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 rounded-full border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
