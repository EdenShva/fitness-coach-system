import { useState } from "react";
import api from "../api/api";

function Login() {
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/api/auth/login", {
        email: identifier, // שדה email משמש כ-"Email or Username"
        password: password,
      });

      const data = response.data;
      console.log("LOGIN RESPONSE:", data);

      const token = data.token;
      const role = data.user?.role || data.role;

      if (!token || !role) {
        setMessage("Login response missing token or role");
        return;
      }

      // שמירה לזיכרון דפדפן
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ניתוב לפי תפקיד
      if (role === "coach") {
        window.location.href = "/coach";
      } else if (role === "client") {
        window.location.href = "/client";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      if (err.response) {
        setMessage(err.response.data.message || "Login failed");
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;
