import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [mode, setMode] = useState("login"); // login | register

  // login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // register fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // NEW FIELDS:
  const [birthDate, setBirthDate] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");

  // =====================
  //     LOGIN
  // =====================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: identifier,
          password: password,
        }
      );

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "coach") window.location.href = "/coach";
      else window.location.href = "/client";

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  // =====================
  //     REGISTER CLIENT
  // =====================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (regPassword !== regConfirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: regUsername,
          email: regEmail,
          password: regPassword,
          role: "client",     // חשוב!! רק לקוחות נרשמים כאן
          birthDate,
          idNumber,
          address,
        }
      );

      setMessage("Registration successful. You can now log in.");
      setMode("login");

      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
      setBirthDate("");
      setIdNumber("");
      setAddress("");

    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5"
    }}>
      
      <div style={{
        width: "320px",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        
        <h2 style={{ textAlign: "center" }}>Fitness Coach</h2>

        {/* Toggle login/register */}
        <div style={{
          display: "flex",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          overflow: "hidden"
        }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: mode === "login" ? "#3498db" : "#fff",
              color: mode === "login" ? "#fff" : "#000",
              border: "none",
              cursor: "pointer"
            }}
          >
            התחברות
          </button>

          <button
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: mode === "register" ? "#3498db" : "#fff",
              color: mode === "register" ? "#fff" : "#000",
              border: "none",
              cursor: "pointer"
            }}
          >
            הרשמה ללקוח
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              required
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#3498db",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              התחברות
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit}>
            
            <input
              type="text"
              placeholder="Username"
              value={regUsername}
              required
              onChange={(e) => setRegUsername(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              required
              onChange={(e) => setRegEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              required
              onChange={(e) => setRegPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={regConfirmPassword}
              required
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            {/* NEW FIELDS */}
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <input
              type="text"
              placeholder="ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#2ecc71",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              הרשמה כלקוח חדש
            </button>
          </form>
        )}

        {/* MESSAGE */}
        {message && (
          <p style={{ marginTop: "10px", color: "red", textAlign: "center" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
