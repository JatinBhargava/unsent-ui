import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

type FriendStatus = "none" | "requested" | "incoming" | "friends";

interface FriendUser {
  id: number;
  name: string;
  username: string;
  bio: string;
  status: FriendStatus;
}

const seedUsers: FriendUser[] = [
  {
    id: 1,
    name: "Aarav Mehta",
    username: "aaravwrites",
    bio: "Late-night journaler and chai lover.",
    status: "none",
  },
  {
    id: 2,
    name: "Mira Shah",
    username: "mira.notes",
    bio: "Poetry fragments and honest pages.",
    status: "incoming",
  },
  {
    id: 3,
    name: "Kabir Nair",
    username: "kabir_ink",
    bio: "Minimal words. Maximum feeling.",
    status: "friends",
  },
  {
    id: 4,
    name: "Naina Rao",
    username: "naina.daily",
    bio: "Morning reflections and tiny wins.",
    status: "requested",
  },
];

export default function Friends() {
  const [users, setUsers] = useState<FriendUser[]>(seedUsers);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [inviteId, setInviteId] = useState<number | null>(null);
  const [activeFriendId, setActiveFriendId] = useState<number>(3);
  const [messageInput, setMessageInput] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [messagesByFriend, setMessagesByFriend] = useState<
    Record<number, string[]>
  >({
    3: ["Hey, want to co-write tonight?", "Yes. Let us start at 9 PM."],
  });

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q)
    );
  }, [users, query]);

  const incomingRequests = users.filter((u) => u.status === "incoming");
  const sentRequests = users.filter((u) => u.status === "requested");
  const friends = users.filter((u) => u.status === "friends");
  const activeFriend =
    users.find((u) => u.id === activeFriendId && u.status === "friends") ||
    friends[0] ||
    null;

  const updateStatus = (id: number, status: FriendStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const handleInvite = (id: number) => {
    setInviteId(id);
    window.setTimeout(() => setInviteId(null), 1500);
  };

  const handleStartCall = () => {
    if (!activeFriend) return;
    setIsCalling(true);
    window.setTimeout(() => setIsCalling(false), 8000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFriend || !messageInput.trim()) return;

    const text = messageInput.trim();
    setMessagesByFriend((prev) => ({
      ...prev,
      [activeFriend.id]: [...(prev[activeFriend.id] || []), text],
    }));
    setMessageInput("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="w-full max-w-5xl">
        <Navbar />

        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Your <span className="italic">Friends</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Discover writers, send requests, accept invites, and start writing
            together.
          </p>
        </header>

        <section className="mb-6">
          <div className="mx-auto flex max-w-lg items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="p-1 text-gray-700 transition hover:opacity-70"
              title="Search friends"
            >
              🔍
            </button>
            {searchOpen && (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search friends..."
                className="w-full rounded-full border border-gray-300 bg-white/95 px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            )}
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">Friends</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{friends.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">Incoming</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{incomingRequests.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">Sent</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{sentRequests.length}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 shadow-[0_10px_22px_rgba(17,24,39,0.06)] ring-1 ring-white/80"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500">@{user.username}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">{user.name}</h3>
              <p className="mt-2 text-sm text-gray-600">{user.bio}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {user.status === "none" && (
                  <button
                    onClick={() => updateStatus(user.id, "requested")}
                    className="rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black"
                  >
                    Add Friend
                  </button>
                )}

                {user.status === "requested" && (
                  <>
                    <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-800">
                      Request Sent
                    </span>
                    <button
                      onClick={() => updateStatus(user.id, "none")}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {user.status === "incoming" && (
                  <>
                    <button
                      onClick={() => updateStatus(user.id, "friends")}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(user.id, "none")}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Reject
                    </button>
                  </>
                )}

                {user.status === "friends" && (
                  <>
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-800">
                      Friends
                    </span>
                    <button
                      onClick={() => handleInvite(user.id)}
                      className="rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black"
                    >
                      Invite to Co-write
                    </button>
                    {inviteId === user.id && (
                      <span className="rounded-full bg-cyan-100 px-3 py-2 text-xs font-medium text-cyan-800">
                        Invite sent
                      </span>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 shadow-[0_10px_22px_rgba(17,24,39,0.06)] ring-1 ring-white/80 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-gray-900">
            Chat & Voice Call
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <aside className="rounded-2xl border border-gray-200/80 bg-white p-3 lg:col-span-1">
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                Friend List
              </p>
              {friends.length === 0 && (
                <p className="text-sm text-gray-500">No friends yet.</p>
              )}
              <div className="space-y-2">
                {friends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setActiveFriendId(friend.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                      activeFriendId === friend.id
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {friend.name}
                    <span className="ml-1 text-xs opacity-80">
                      @{friend.username}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 lg:col-span-2">
              {!activeFriend && (
                <p className="text-sm text-gray-500">
                  Add or accept friends to start chatting.
                </p>
              )}

              {activeFriend && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {activeFriend.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{activeFriend.username}
                      </p>
                    </div>
                    <button
                      onClick={handleStartCall}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                        isCalling
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-900 text-white hover:bg-black"
                      }`}
                    >
                      {isCalling ? "Calling..." : "Voice Call"}
                    </button>
                  </div>

                  <div className="mb-3 h-56 overflow-y-auto rounded-xl border border-gray-200 bg-stone-50 p-3">
                    {(messagesByFriend[activeFriend.id] || []).length === 0 && (
                      <p className="text-sm text-gray-500">
                        No messages yet. Say hi.
                      </p>
                    )}
                    <div className="space-y-2">
                      {(messagesByFriend[activeFriend.id] || []).map((msg, idx) => (
                        <div
                          key={`${activeFriend.id}-${idx}`}
                          className="max-w-[85%] rounded-2xl bg-white px-3 py-2 text-sm text-gray-800 shadow-sm"
                        >
                          {msg}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2"
                  >
                    <input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-gray-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-black"
                    >
                      Send
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
