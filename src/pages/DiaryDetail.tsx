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
  submitContribution,
  getPendingContributions,
  acceptContribution,
  rejectContribution,
  type DiaryRecord,
  type ContributionRequest,
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
const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editVisibility, setEditVisibility] = useState("Public");
  const [editStatus, setEditStatus] = useState("ACTIVE");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInscribePanel, setShowInscribePanel] = useState(false);
  const [inscribeContent, setInscribeContent] = useState("");
  const [inscribeVisibility, setInscribeVisibility] = useState<"Public" | "Private">("Public");
  const [isInscribing, setIsInscribing] = useState(false);
  const [pendingContributions, setPendingContributions] = useState<ContributionRequest[]>([]);
  const [showInscribeRequests, setShowInscribeRequests] = useState(false);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const [expandedContributions, setExpandedContributions] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    if (diary && currentUserId && String(diary.userId) === String(currentUserId)) {
      fetchPendingContributions(diary.recordId);
    }
  }, [diary?.recordId, currentUserId]);

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

  const handleInscribe = async () => {
    if (!diary || !inscribeContent.trim() || !currentUserId) return;
    try {
      setIsInscribing(true);
      await submitContribution(diary.recordId, currentUserId, inscribeContent.trim());
      setShowInscribePanel(false);
      setInscribeContent("");
      showNotification("success", "Your inscription was added!");
    } catch {
      showNotification("error", "Failed to inscribe. Please try again.");
    } finally {
      setIsInscribing(false);
    }
  };

  const fetchPendingContributions = async (diaryId: number) => {
    try {
      setContributionsLoading(true);
      const data = await getPendingContributions(diaryId);
      setPendingContributions(data);
    } catch {
      setPendingContributions([]);
    } finally {
      setContributionsLoading(false);
    }
  };

  const handleAccept = async (contributionId: string) => {
    try {
      await acceptContribution(contributionId);
      setPendingContributions((prev) => prev.filter((c) => c.contributionId !== contributionId));
      showNotification("success", "Inscription accepted!");
    } catch {
      showNotification("error", "Failed to accept. Please try again.");
    }
  };

  const handleReject = async (contributionId: string) => {
    try {
      await rejectContribution(contributionId);
      setPendingContributions((prev) => prev.filter((c) => c.contributionId !== contributionId));
      showNotification("success", "Inscription rejected.");
    } catch {
      showNotification("error", "Failed to reject. Please try again.");
    }
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

        {/* Header */}
        <header className="mb-7 sm:mb-10 relative">
          {/* Top row: back button left, owner actions right */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => navigate("/diaries")}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Diaries
            </button>

            {currentUserId && String(diary.userId) === String(currentUserId) && (
            <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showNotification("success", "Link copied to clipboard!");
              }}
              title="Share"
              className="flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white/70 text-gray-500 backdrop-blur-sm transition hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-600"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
            <button
              onClick={handleEditClick}
              title="Edit"
              className="flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white/70 text-gray-500 backdrop-blur-sm transition hover:border-green-300 hover:bg-green-50 hover:text-green-600"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              title="Delete"
              className="flex items-center justify-center h-7 w-7 rounded-full border border-gray-200 bg-white/70 text-gray-400 backdrop-blur-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
          )}
          </div>

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
          <div className="flex items-center justify-between gap-4">
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
            {currentUserId && String(diary.userId) !== String(currentUserId) && (
              <button
                onClick={() => setShowInscribePanel(true)}
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-white/70 px-4 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
              >
                <svg className="h-3 w-3 transition group-hover:rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Inscribe
              </button>
            )}
          </div>
        </header>

        {/* Inscribe Requests — owner only */}
        {currentUserId && diary && String(diary.userId) === String(currentUserId) && (
          <div className="mb-6">
            <button
              onClick={() => {
                setShowInscribeRequests(!showInscribeRequests);
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              <span>Inscribe Requests</span>
              {pendingContributions.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-gray-900 text-white text-[11px] font-semibold px-1.5">
                  {pendingContributions.length}
                </span>
              )}
              <svg
                className={`h-4 w-4 transition-transform ${showInscribeRequests ? "rotate-180" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showInscribeRequests && (
              <div className="mt-3 rounded-2xl border border-gray-200 bg-white overflow-hidden">
                {contributionsLoading && (
                  <p className="px-5 py-4 text-sm text-gray-400">Loading requests...</p>
                )}
                {!contributionsLoading && pendingContributions.length === 0 && (
                  <p className="px-5 py-4 text-sm text-gray-400">No pending inscribe requests.</p>
                )}
                {!contributionsLoading && pendingContributions.map((c, i) => {
                  const isExpanded = expandedContributions.has(c.contributionId);
                  const toggle = () =>
                    setExpandedContributions((prev) => {
                      const next = new Set(prev);
                      isExpanded ? next.delete(c.contributionId) : next.add(c.contributionId);
                      return next;
                    });
                  return (
                    <div key={c.contributionId} className={i !== 0 ? "border-t border-gray-100" : ""}>
                      {/* Header row — always visible */}
                      <div className="flex items-center justify-between gap-3 px-5 py-3">
                        <button
                          onClick={toggle}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition min-w-0"
                        >
                          <span className="font-medium">Contributor #{c.contributorId}</span>
                          <svg
                            className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          >
                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleAccept(c.contributionId)}
                            className="rounded-full bg-gray-900 text-white px-3 py-1 text-xs font-medium hover:opacity-80 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(c.contributionId)}
                            className="rounded-full border border-gray-300 text-gray-600 px-3 py-1 text-xs font-medium hover:bg-gray-100 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* Dropdown content */}
                      {isExpanded && (
                        <div className="px-5 pb-4">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-l-2 border-gray-200 pl-3">
                            {c.content}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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

        {/* Inscribe Modal */}
        {showInscribePanel && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Inscribe your words</h2>
                <p className="text-xs text-gray-400 mt-0.5">Saved as a new diary entry in your account</p>
              </div>
              <div className="p-6 space-y-4">
                <textarea
                  autoFocus
                  placeholder="Continue the story, add your thoughts, or leave a response..."
                  value={inscribeContent}
                  onChange={(e) => setInscribeContent(e.target.value)}
                  rows={8}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Visibility</p>
                    <p className="text-xs text-gray-400">{inscribeVisibility === "Public" ? "Anyone can read this" : "Only you can read this"}</p>
                  </div>
                  <button
                    onClick={() => setInscribeVisibility(inscribeVisibility === "Public" ? "Private" : "Public")}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${inscribeVisibility === "Public" ? "bg-black" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${inscribeVisibility === "Public" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => { setShowInscribePanel(false); setInscribeContent(""); }}
                  disabled={isInscribing}
                  className="flex-1 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInscribe}
                  disabled={isInscribing || !inscribeContent.trim()}
                  className="flex-1 rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
                >
                  {isInscribing ? "Inscribing..." : "Inscribe"}
                </button>
              </div>
            </div>
          </div>
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
