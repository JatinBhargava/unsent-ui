import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDiaries, type DiaryRecord } from "../services/Diary";
import { getUserById, getUserByEmail } from "../services/Auth";
import { useAuth } from "../contexts/AuthContext";
import { sendFriendRequest, getFriendRequestStatus, getIncomingRequests } from "../services/Friends";

export default function Diaries() {
  const navigate = useNavigate();
  const { isLoggedIn, userId: authUserId, email } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(authUserId);
  const [userStatusMap, setUserStatusMap] = useState<Map<string, "FRS01" | "FRS02">>(new Map());
  const [diaries, setDiaries] = useState<DiaryRecord[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authUserId) {
      setCurrentUserId(authUserId);
    } else if (email) {
      getUserByEmail(email)
        .then((user) => setCurrentUserId(String(user.id || user.userId || "")))
        .catch(() => {});
    }
  }, [authUserId, email]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const data = await getDiaries();
        const diaryList = Array.isArray(data) ? data : [data];
        setDiaries(diaryList);
        setError(null);

        // Fetch usernames for all diaries
        const usernameMap: { [key: string]: string } = {};
        for (const diary of diaryList) {
          if (diary.userId && !usernameMap[diary.userId]) {
            try {
              const user = await getUserById(diary.userId);
              usernameMap[diary.userId] = user.displayName;
            } catch (error) {
              usernameMap[diary.userId] = String(diary.userId);
            }
          }
        }
        setUsernames(usernameMap);
      } catch (err) {
        setError("Failed to load diaries");
        setDiaries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  useEffect(() => {
    if (!currentUserId || diaries.length === 0) return;
    const otherUserIds = [...new Set(
      diaries
        .map((d) => String(d.userId))
        .filter((id) => id !== String(currentUserId))
    )];

    const buildStatusMap = async () => {
      const map = new Map<string, "FRS01" | "FRS02">();

      // outgoing requests: status for requests current user sent
      await Promise.allSettled(
        otherUserIds.map(async (id) => {
          try {
            const status = await getFriendRequestStatus(currentUserId, id);
            if (status === "FRS01" || status === "FRS02") map.set(id, status);
          } catch {}
        })
      );

      // incoming requests: covers the case where current user is the receiver
      try {
        const incoming = await getIncomingRequests(currentUserId);
        for (const req of incoming) {
          const sid = String(req.sender_id);
          if (req.request_status === "FRS02") map.set(sid, "FRS02");
          else if (req.request_status === "FRS01" && !map.has(sid)) map.set(sid, "FRS01");
        }
      } catch {}

      setUserStatusMap(map);
    };

    buildStatusMap();
  }, [currentUserId, diaries]);

  const openDiary = (id: number) => {
    navigate(`/diary/${id}`);
  };

  const handleWrite = () => {
    navigate("/write");
  };

  const truncateContent = (content: string, limit: number = 200) => {
    return content.length > limit
      ? content.substring(0, limit) + "..."
      : content;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="relative z-10 w-full max-w-5xl xl:max-w-7xl">
        <Navbar />

        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Public <span className="italic">Diaries</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            These are notebooks left open. Read quietly. Add a page if it speaks
            to you.
          </p>
          {isLoggedIn && (
            <button
              onClick={handleWrite}
              className="mt-6 sm:mt-8 inline-block rounded-full bg-gray-900 text-white px-6 sm:px-8 py-2 sm:py-2.5 shadow-[0_12px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.22)] transition font-medium text-sm sm:text-base"
            >
              ✏️ Start Writing
            </button>
          )}
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading diaries...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && diaries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No diaries found. Start writing one!
            </p>
          </div>
        )}

        {/* Diary List */}
        {!loading && !error && diaries.length > 0 && (
          <section className="grid gap-4 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {diaries.map((diary) => (
              <div
                key={diary.recordId}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 sm:p-7 shadow-[0_14px_30px_rgba(17,24,39,0.07)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_24px_55px_rgba(17,24,39,0.14)]"
                onClick={() => openDiary(diary.recordId)}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-stone-50/70 opacity-70" />
                <div className="pointer-events-none absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-gray-300/70 to-transparent" />

                <div className="relative mb-3 flex items-center justify-between">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide ${
                      diary.status === "Published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {diary.status}
                  </span>
                  <span className="text-[11px] text-gray-600 font-medium">
                    by {usernames[diary.userId] || diary.userId}
                  </span>
                </div>

                <h3 className="relative mb-2 text-base sm:text-lg font-semibold tracking-tight text-gray-900 line-clamp-2">
                  {diary.title || `Diary Entry #${diary.recordId}`}
                </h3>

                <p className="relative text-gray-700 text-sm leading-relaxed line-clamp-4 font-medium">
                  {truncateContent(diary.content, 150)}
                </p>

                <div className="relative mt-5 border-t border-gray-200/70 pt-4 sm:mt-6 flex justify-between items-center text-xs text-gray-500">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
                    {diary.visibility}
                  </span>
                  <div className="flex items-center gap-2">
                    {isLoggedIn && currentUserId && String(diary.userId) !== String(currentUserId) && (() => {
                      const status = userStatusMap.get(String(diary.userId));
                      if (status === "FRS02") {
                        return (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                            Friends
                          </span>
                        );
                      }
                      if (status === "FRS01") {
                        return (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800">
                            Requested
                          </span>
                        );
                      }
                      return (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await sendFriendRequest(currentUserId, String(diary.userId));
                              setUserStatusMap((prev) => new Map(prev).set(String(diary.userId), "FRS01"));
                            } catch {
                              // silently fail
                            }
                          }}
                          className="rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-black"
                        >
                          + Add Friend
                        </button>
                      );
                    })()}
                    <span className="translate-x-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-600">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
