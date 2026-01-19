import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // מצפים שיחזור:
      // {
      //   message: "Login successful",
      //   token: "...",
      //   user: { id, username, role }
      // }

      if (!data.token || !data.user || !data.user.role) {
        setMessage("Login response is missing token or role");
        return;
      }

      const token = data.token;
      const role = data.user.role;

      // שמירת הנתונים לזיכרון בדפדפן
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ניווט לפי תפקיד
      if (role === "coach") {
        window.location.href = "/coach";
      } else if (role === "client") {
        window.location.href = "/client";
      } else {
        // ליתר ביטחון
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;
