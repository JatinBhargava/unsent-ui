import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import {
  getUserById,
  getUserByEmail,
  updateUserProfile,
} from "../services/Auth";

interface UserProfile {
  id: number;
  userId?: string | number;
  displayName?: string;
  username?: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  interests?: string;
  bio?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn, userId, email, logout } = useAuth();
  const [resolvedUserId, setResolvedUserId] = useState<string | number | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    gender: "",
    dateOfBirth: "",
    bio: "",
  });

  useEffect(() => {
    if (!isLoggedIn) { navigate("/login"); return; }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        let user;
        if (email) user = await getUserByEmail(email);
        else if (userId) user = await getUserById(userId);

        if (user) {
          setProfile(user);
          setResolvedUserId(user.userId || user.id || userId || null);
          setForm({
            displayName: user.displayName || "",
            gender: user.gender || "",
            dateOfBirth: user.dateOfBirth || "",
            bio: user.bio || "",
          });
          if (user.photoUrl) setPhotoPreview(user.photoUrl);
        } else {
          setError("Unable to fetch profile data");
        }
        setError(null);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, userId, email, navigate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const canEditGender = !profile?.gender;
  const canEditDob = !profile?.dateOfBirth;

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setError(null);
      const payload: { displayName?: string; gender?: string; dateOfBirth?: string; bio?: string } = {};
      if (form.displayName !== (profile.displayName || "")) payload.displayName = form.displayName.trim();
      if (canEditGender && form.gender && form.gender !== profile.gender) payload.gender = form.gender;
      if (canEditDob && form.dateOfBirth && form.dateOfBirth !== profile.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;
      if (form.bio !== (profile.bio || "")) payload.bio = form.bio.trim();

      if (Object.keys(payload).length === 0) { setIsEditing(false); return; }

      const targetUserId = resolvedUserId ?? profile.userId ?? profile.id ?? userId ?? null;
      if (!targetUserId) { setError("User ID not found. Please login again."); return; }

      await updateUserProfile(targetUserId, payload);

      let refreshedUser: UserProfile | null = null;
      try { refreshedUser = await getUserById(targetUserId); } catch { refreshedUser = null; }

      const mergedUser: UserProfile = refreshedUser || { ...profile, ...payload };
      setProfile(mergedUser);
      setForm({
        displayName: mergedUser.displayName || "",
        gender: mergedUser.gender || "",
        dateOfBirth: mergedUser.dateOfBirth || "",
        bio: mergedUser.bio || "",
      });
      setIsEditing(false);
    } catch {
      setError("Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.name || profile?.displayName || "User";
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-rose-100/25 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl">
        <Navbar />

        {loading && (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">Loading…</div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {!loading && profile && (
          <div className="mt-8 space-y-5">

            {/* Avatar + name card */}
            <div className="rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 flex flex-col items-center text-center gap-4">
              <label className="relative cursor-pointer group">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl font-semibold text-amber-700">
                      {initials}
                    </div>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 border-2 border-white text-white text-[10px] shadow group-hover:scale-110 transition">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                  </svg>
                </span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="text-center text-xl font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-gray-600 text-gray-900 w-48"
                  placeholder="Display name"
                />
              ) : (
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
                  <p className="text-xs text-gray-400 mt-0.5">@{profile.username || "username"}</p>
                </div>
              )}

              {isEditing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  placeholder="A little about you…"
                  className="w-full max-w-sm text-center text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-400 resize-none placeholder:text-gray-300"
                />
              ) : (
                profile.bio && (
                  <p className="text-sm text-gray-500 max-w-sm leading-relaxed">"{profile.bio}"</p>
                )
              )}

              <div className="flex items-center gap-2 mt-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                      className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => void handleSaveProfile()}
                      disabled={saving}
                      className="rounded-full bg-gray-900 text-white px-4 py-1.5 text-xs font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </div>

            {/* Details card */}
            <div className="rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6 space-y-5">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400">Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Gender</p>
                  {isEditing ? (
                    <>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        disabled={!canEditGender}
                        className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:text-gray-400 disabled:bg-gray-50"
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </select>
                      {!canEditGender && <p className="mt-1 text-[11px] text-gray-400">Can only be set once.</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700">{profile.gender || <span className="text-gray-400">Not set</span>}</p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Date of Birth</p>
                  {isEditing ? (
                    <>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        disabled={!canEditDob}
                        className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:text-gray-400 disabled:bg-gray-50"
                      />
                      {!canEditDob && <p className="mt-1 text-[11px] text-gray-400">Can only be set once.</p>}
                    </>
                  ) : (
                    <p className="text-sm text-gray-700">{profile.dateOfBirth || <span className="text-gray-400">Not set</span>}</p>
                  )}
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Email</p>
                  <p className="text-sm text-gray-700">{profile.email || email || "—"}</p>
                </div>
              </div>
            </div>

            {/* Interests */}
            {profile.interests && (
              <div className="rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6">
                <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.split(",").map((interest, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800"
                    >
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Logout */}
            <div className="pt-2 pb-4 text-center">
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {!loading && !profile && !error && (
          <div className="flex items-center justify-center py-24 text-sm text-gray-400">Profile not found.</div>
        )}
      </div>
    </div>
  );
}
