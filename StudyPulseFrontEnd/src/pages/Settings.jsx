import { useState } from "react";
import { updatePasswordApi } from "../api/userApi";
import { getApiErrorMessage } from "../utils/apiError";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#0d1322] px-4 py-3 text-[#dde2f8] placeholder-[#8d90a0] transition focus:border-[#b4c5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#b4c5ff]/20";

function Settings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSaving(true);

    try {
      const response = await updatePasswordApi(oldPassword, newPassword);
      const successMessage =
        response.data?.message || "Password updated successfully.";

      setMessage({ type: "success", text: successMessage });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({
        type: "error",
        text: getApiErrorMessage(error, "Unable to update password."),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#dde2f8]">Settings</h1>
        <p className="mt-1 text-sm text-[#c3c6d7]">Update your account security</p>
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
        <h2 className="mb-6 text-xl font-semibold text-[#dde2f8]">Change Password</h2>

        <form onSubmit={handlePasswordChange} className="max-w-xl space-y-5">
          <div>
            <label className="mb-2 block text-sm text-[#c3c6d7]">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={inputClassName}
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#c3c6d7]">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClassName}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#c3c6d7]">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClassName}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
