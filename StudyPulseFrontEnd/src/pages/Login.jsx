import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import AuthShell from "../components/AuthShell";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-[#0d1322] px-4 py-3 text-[#dde2f8] placeholder-[#8d90a0] transition focus:border-[#b4c5ff]/50 focus:outline-none focus:ring-2 focus:ring-[#b4c5ff]/20 disabled:opacity-50";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginApi(email.trim(), password);

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      const message =
        (typeof data === "string" ? data : data?.message) ||
        (err.code === "ERR_NETWORK"
          ? "Cannot reach the server. Make sure the backend is running."
          : "Login failed. Check your email and password.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your study journey"
      error={error}
      footer={
        <>
          No account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#b4c5ff] transition hover:text-[#dde2f8]"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-[#c3c6d7]"
          >
            Email
          </label>
          <input
            id="login-email"
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
            htmlFor="login-password"
            className="mb-2 block text-sm font-medium text-[#c3c6d7]"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            autoComplete="current-password"
            className={inputClassName}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#b4c5ff] py-3 text-sm font-bold text-[#00174b] shadow-lg shadow-blue-500/20 transition hover:bg-[#2563eb] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Login;
