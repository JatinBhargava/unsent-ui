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
  const [visibilityFilter, setVisibilityFilter] = useState<"Public" | "Private">("Public");

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

  const filteredDiaries = diaries.filter((d) => d.visibility === visibilityFilter);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-rose-100/15 blur-3xl" />

      <div className="relative z-10">
        {/* Navbar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
          <Navbar />
        </div>

        {/* Header — always centered */}
        <header className="text-center max-w-xl mx-auto px-4 pt-4 sm:pt-6 pb-6 sm:pb-10">
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-gray-400 mb-2">
            {visibilityFilter === "Public" ? "Open notebooks" : "Your private pages"}
          </p>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
            {visibilityFilter === "Public" ? (
              <>Words left <span className="italic text-amber-700/80">open</span></>
            ) : (
              <>Your <span className="italic">private</span> pages</>
            )}
          </h1>
          <p className="mt-2 sm:mt-3 text-gray-500 text-xs sm:text-sm leading-relaxed">
            {visibilityFilter === "Public"
              ? "These are notebooks left open. Read quietly. Add a page if it speaks to you."
              : "These pages are just for you. Write freely."}
          </p>
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 p-1 shadow-sm backdrop-blur-sm">
              {(["Public", "Private"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setVisibilityFilter(opt)}
                  className={`rounded-full px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    visibilityFilter === opt ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {isLoggedIn && (
              <button
                onClick={handleWrite}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium hover:-translate-y-0.5 transition shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
              >
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New entry
              </button>
            )}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start px-4 sm:px-8 lg:px-10 pb-16">

          {/* Mobile: horizontal strip */}
          <div className="lg:hidden w-full">
            <div className="rounded-2xl border border-amber-200/60 bg-white/50 backdrop-blur-sm px-4 py-3">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">Coming soon</span>
                <span className="text-xs font-medium text-gray-700">Side Quests</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[
                  { label: "Daily prompt", icon: "✦" },
                  { label: "Chain stories", icon: "⟳" },
                  { label: "Confessions", icon: "◎" },
                  { label: "1-line diary", icon: "—" },
                  { label: "Share a diary", icon: "↗" },
                  { label: "Postcards to loved ones", icon: "♡" },
                ].map((q) => (
                  <span key={q.label} className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/60 px-3 py-1 text-[11px] text-amber-700/80 whitespace-nowrap">
                    <span className="text-amber-400 text-[10px]">{q.icon}</span>
                    {q.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: sticky sidebar */}
          <aside className="hidden lg:block w-48 xl:w-52 shrink-0 sticky top-8">
            <div className="rounded-2xl border border-amber-200/60 bg-white/50 backdrop-blur-sm p-4 space-y-3">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                Coming soon
              </span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Side Quests</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                  Bite-sized writing missions — prompts, chain stories, anonymous confessions.
                </p>
              </div>
              <ul className="space-y-1.5">
                {[
                  { label: "Daily prompt", icon: "✦" },
                  { label: "Chain stories", icon: "⟳" },
                  { label: "Confessions", icon: "◎" },
                  { label: "1-line diary", icon: "—" },
                  { label: "Share a diary", icon: "↗" },
                  { label: "Postcards to loved ones", icon: "♡" },
                ].map((q) => (
                  <li key={q.label} className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-amber-400 text-[10px] w-3 shrink-0">{q.icon}</span>
                    {q.label}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full rounded-full bg-amber-50 border border-amber-200 py-1.5 text-[11px] font-medium text-amber-600 opacity-50 cursor-not-allowed">
                Notify me
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {loading && (
              <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                Loading diaries…
              </div>
            )}

            {error && (
              <div className="text-center py-10 text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && filteredDiaries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-3xl">📖</p>
                <p className="text-sm text-gray-500">No {visibilityFilter.toLowerCase()} diaries yet.</p>
                {isLoggedIn && (
                  <button onClick={handleWrite} className="mt-2 rounded-full border border-gray-300 px-5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition">
                    Be the first to write
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filteredDiaries.length > 0 && (
              /* Mobile: full-width stacked feed. Tablet+: 2-col grid. Desktop+: 3-col */
              <section className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
                {filteredDiaries.map((diary, idx) => {
                  const wordCount = diary.content?.trim().split(/\s+/).length ?? 0;
                  const readMins = Math.max(1, Math.round(wordCount / 200));
                  const authorName = usernames[diary.userId] || "—";
                  const initials = authorName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

                  const palette = [
                    { avatar: "bg-[#f5e6e6] text-rose-500"    },
                    { avatar: "bg-[#ede8f9] text-violet-500"  },
                    { avatar: "bg-[#e4f1fa] text-sky-500"     },
                    { avatar: "bg-[#ddf2e8] text-emerald-600" },
                    { avatar: "bg-[#f5ecd5] text-amber-600"   },
                    { avatar: "bg-[#f7e4f2] text-pink-500"    },
                  ];
                  const color = palette[idx % palette.length];

                  return (
                  <div
                    key={diary.recordId}
                    className="group cursor-pointer flex flex-col rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 transition-all duration-200 active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-sm"
                    onClick={() => openDiary(diary.recordId)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diary.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {diary.status}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {diary.createdAt ? new Date(diary.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
                      {diary.title || `Entry #${diary.recordId}`}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 sm:line-clamp-4 flex-1 mb-3">
                      {truncateContent(diary.content, 200)}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${color.avatar}`}>
                          {initials}
                        </div>
                        <span className="text-[11px] text-gray-400 truncate">{authorName}</span>
                        <span className="text-[10px] text-gray-300">· {readMins}m</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isLoggedIn && currentUserId && String(diary.userId) !== String(currentUserId) && (() => {
                          const status = userStatusMap.get(String(diary.userId));
                          if (status === "FRS02") return <span className="text-[10px] text-emerald-500">Friends</span>;
                          if (status === "FRS01") return <span className="text-[10px] text-amber-500">Pending</span>;
                          return (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await sendFriendRequest(currentUserId, String(diary.userId));
                                  setUserStatusMap((prev) => new Map(prev).set(String(diary.userId), "FRS01"));
                                } catch {}
                              }}
                              className="text-[10px] text-gray-400 hover:text-gray-700 transition"
                            >+ Follow</button>
                          );
                        })()}
                        <span className="text-xs text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all">→</span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
