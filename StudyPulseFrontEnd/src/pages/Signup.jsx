import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../api/authApi";
import AuthShell from "../components/AuthShell";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#0d1322] px-4 py-3 text-[#dde2f8] placeholder-[#8d90a0] transition focus:border-[#b4c5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#b4c5ff]/20 disabled:opacity-50";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await signupApi(name.trim(), email.trim(), password);

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      const message =
        (typeof data === "string" ? data : data?.message) ||
        (err.code === "ERR_NETWORK"
          ? "Cannot reach the server. Make sure the backend is running."
          : "Signup failed. Please try again.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Sign up to start tracking your study sessions"
      error={error}
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#b4c5ff] transition hover:text-[#dde2f8]"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="signup-name"
            className="mb-2 block text-sm font-medium text-[#c3c6d7]"
          >
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            autoComplete="name"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-medium text-[#c3c6d7]"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            autoComplete="email"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-medium text-[#c3c6d7]"
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            autoComplete="new-password"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-2 block text-sm font-medium text-[#c3c6d7]"
          >
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            autoComplete="new-password"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-[#b4c5ff] py-3 text-sm font-bold text-[#00174b] shadow-lg shadow-blue-500/20 transition hover:bg-[#2563eb] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Signup;
