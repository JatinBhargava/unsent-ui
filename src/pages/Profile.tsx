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
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        let user;

        // Prefer fetching by email, then use user.userId for profile updates.
        if (email) {
          user = await getUserByEmail(email);
        } else if (userId) {
          user = await getUserById(userId);
        }

        if (user) {
          setProfile(user);
          setResolvedUserId(user.userId || user.id || userId || null);
          setForm({
            displayName: user.displayName || "",
            gender: user.gender || "",
            dateOfBirth: user.dateOfBirth || "",
            bio: user.bio || "",
          });
          if (user.photoUrl) {
            setPhotoPreview(user.photoUrl);
          }
        } else {
          setError("Unable to fetch profile data");
        }
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
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
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const canEditGender = !profile?.gender;
  const canEditDob = !profile?.dateOfBirth;

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);

      const payload: {
        displayName?: string;
        gender?: string;
        dateOfBirth?: string;
        bio?: string;
      } = {};

      if (form.displayName !== (profile.displayName || "")) {
        payload.displayName = form.displayName.trim();
      }

      if (canEditGender && form.gender && form.gender !== profile.gender) {
        payload.gender = form.gender;
      }

      if (
        canEditDob &&
        form.dateOfBirth &&
        form.dateOfBirth !== profile.dateOfBirth
      ) {
        payload.dateOfBirth = form.dateOfBirth;
      }

      if (form.bio !== (profile.bio || "")) {
        payload.bio = form.bio.trim();
      }

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        return;
      }

      const targetUserId =
        resolvedUserId ?? profile.userId ?? profile.id ?? userId ?? null;

      if (!targetUserId) {
        setError("User ID not found. Please login again.");
        return;
      }

      await updateUserProfile(targetUserId, payload);

      let refreshedUser: UserProfile | null = null;
      try {
        refreshedUser = await getUserById(targetUserId);
      } catch {
        refreshedUser = null;
      }

      const mergedUser: UserProfile = refreshedUser || {
        ...profile,
        ...payload,
      };

      setProfile(mergedUser);
      setForm({
        displayName: mergedUser.displayName || "",
        gender: mergedUser.gender || "",
        dateOfBirth: mergedUser.dateOfBirth || "",
        bio: mergedUser.bio || "",
      });
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      setError("Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 py-8 sm:px-6 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="w-full max-w-5xl">
        <Navbar />

        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Your <span className="italic">Profile</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Manage your personal details and account preferences.
          </p>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Profile Content */}
        {!loading && profile && (
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Header - Photo & Name */}
            <div className="p-2 sm:p-4">
              <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[240px_1fr]">
                {/* Photo Upload - Left Side */}
                <div className="flex flex-col items-center">
                  <label className="relative h-44 w-44 sm:h-48 sm:w-48 cursor-pointer overflow-hidden rounded-full border-4 border-white/80 bg-gradient-to-br from-white to-gray-100 shadow-[0_20px_45px_rgba(17,24,39,0.2)] ring-4 ring-cyan-200/60 transition hover:scale-[1.02] flex items-center justify-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-2xl text-white shadow-lg">
                          ✨
                        </div>
                        <p className="text-xs font-medium text-gray-600">
                          Add profile photo
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <span className="absolute bottom-2 right-2 rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md">
                      Edit
                    </span>
                  </label>
                  <p className="mt-3 text-xs text-gray-500 text-center tracking-wide">
                    Tap avatar to update
                  </p>
                </div>

                {/* Name & Basic Info - Right Side */}
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={form.displayName}
                        onChange={(e) =>
                          setForm({ ...form, displayName: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="Display name"
                      />
                    ) : (
                      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                        {profile.name || profile.displayName || "User"}
                      </h1>
                    )}
                    <p className="text-gray-600 text-sm mt-2">
                      @{profile.username || "username"}
                    </p>
                    </div>
                    <button
                      onClick={() => {
                        if (isEditing) {
                          void handleSaveProfile();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      disabled={saving}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-70"
                    >
                      {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
                    </button>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      placeholder="Write your bio..."
                      className="w-full rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  ) : (
                    profile.bio && (
                      <p className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-gray-700">
                        "{profile.bio}"
                      </p>
                    )
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
                        Gender
                      </label>
                      {isEditing ? (
                        <>
                          <select
                            value={form.gender}
                            onChange={(e) =>
                              setForm({ ...form, gender: e.target.value })
                            }
                            disabled={!canEditGender}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                          >
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                          </select>
                          {!canEditGender && (
                            <p className="mt-1 text-xs text-gray-500">
                              Gender can be updated only once.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 inline-block">
                          {profile.gender || "Gender not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="date"
                            value={form.dateOfBirth}
                            onChange={(e) =>
                              setForm({ ...form, dateOfBirth: e.target.value })
                            }
                            disabled={!canEditDob}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                          />
                          {!canEditDob && (
                            <p className="mt-1 text-xs text-gray-500">
                              Date of birth can be updated only once.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 inline-block">
                          {profile.dateOfBirth || "DOB not set"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Quick vibe
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      Calm writer, reflective storyteller, and memory collector.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="rounded-3xl border border-gray-200/80 bg-[#fffefc] p-6 shadow-[0_14px_30px_rgba(17,24,39,0.07)] ring-1 ring-white/80 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900">
                Interests
              </h2>

              {profile.interests ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.split(",").map((interest, idx) => (
                    <span
                      key={idx}
                      className="inline-block rounded-full border border-amber-200/70 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-sm font-medium text-gray-900"
                    >
                      ✨ {interest.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No interests added yet</p>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                Logout ↩
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !profile && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">Profile information not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
