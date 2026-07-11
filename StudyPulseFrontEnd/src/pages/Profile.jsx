import { useEffect, useState } from "react";
import { getProfileApi, updateProfileApi } from "../api/userApi";
import { getApiErrorMessage } from "../utils/apiError";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#0d1322] px-4 py-3 text-[#dde2f8] placeholder-[#8d90a0] transition focus:border-[#b4c5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#b4c5ff]/20";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const emailChanged =
    profile && editEmail.trim().toLowerCase() !== profile.email?.toLowerCase();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);

    try {
      const response = await getProfileApi();
      const data = response.data;

      setProfile(data);
      setEditName(data.username || "");
      setEditEmail(data.email || "");
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "Unable to load profile."),
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setEditName(profile.username || "");
    setEditEmail(profile.email || "");
    setCurrentPassword("");
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const username = editName.trim();
    const email = editEmail.trim().toLowerCase();

    if (username.length < 2) {
      setMessage({ type: "error", text: "Username must be at least 2 characters." });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ type: "error", text: "Enter a valid email address." });
      return;
    }

    if (emailChanged && !currentPassword) {
      setMessage({
        type: "error",
        text: "Enter your current password to change your email.",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await updateProfileApi({
        username,
        email,
        currentPassword: emailChanged ? currentPassword : undefined,
      });

      setProfile(response.data);
      setIsEditing(false);
      setCurrentPassword("");
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "Unable to update profile."),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <p className="text-[#c3c6d7]">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <p className="text-[#ffb4ab]">{message.text || "Unable to load profile."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#dde2f8]">Profile</h1>
        <p className="mt-1 text-sm text-[#c3c6d7]">Manage your account details</p>
      </div>

      {message.text && (
        <div
          role="alert"
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            message.type === "error"
              ? "border-[#ffb4ab]/30 bg-[#ffb4ab]/10 text-[#ffb4ab]"
              : "border-[#b4c5ff]/30 bg-[#b4c5ff]/10 text-[#b4c5ff]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="glass-card rounded-xl p-8">
        {!isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="mb-1 block text-sm text-[#c3c6d7]">Username</label>
              <span className="text-lg font-medium text-[#dde2f8]">{profile.username}</span>
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#c3c6d7]">Email Address</label>
              <span className="text-lg font-medium text-[#dde2f8]">{profile.email}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-[#c3c6d7]">Username</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#c3c6d7]">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className={inputClassName}
                required
              />
            </div>

            {emailChanged && (
              <div>
                <label className="mb-2 block text-sm text-[#c3c6d7]">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClassName}
                  placeholder="Required to change email"
                  autoComplete="current-password"
                  required
                />
                <p className="mt-2 text-xs text-[#8d90a0]">
                  For security, confirm your password before updating your email.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg border border-white/10 px-5 py-2 text-sm font-semibold text-[#dde2f8] transition hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
