import { useState } from "react";

function Login() {
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // שולחים "email" כדי לא לשבור את השרת אצלך,
        // אבל הוא בעצם Email or Username
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      const token = data.token;
      const role = data.user?.role || data.role;

      if (!token || !role) {
        setMessage("Login response is missing token or role");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "coach") {
        window.location.href = "/coach";
      } else if (role === "client") {
        window.location.href = "/client";
      } else {
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
