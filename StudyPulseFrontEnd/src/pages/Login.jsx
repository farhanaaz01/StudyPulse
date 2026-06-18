import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await loginApi(
      email,
      password
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    alert("Login Successful");

    navigate("/dashboard");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Login Failed"
    );
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "24px",
        borderRadius: "16px",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "16px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Login
      </button>

      <p style={{ marginTop: "14px", textAlign: "center" }}>
        No account? <Link to="/signup">Signup</Link>
      </p>
    </form>
  );
}

export default Login;