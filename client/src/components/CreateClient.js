import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreateClient() {
  const [newName, setNewName] = useState("");
  const [newGoals, setNewGoals] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // שדות חדשים: תאריך לידה, תעודת זהות, כתובת
  const [birthDate, setBirthDate] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleCreateClient = async () => {
    setMessage("");

    if (!newName.trim()) {
      setMessage("Name is required for client");
      return;
    }

    try {
      const response = await api.post("/api/clients", {
        name: newName,
        goals: newGoals,
        notes: newNotes,
        username: newUsername || undefined,
        password: newPassword || undefined,

        // שולחים לשרת את השדות החדשים
        birthDate, // כ-String של date, השרת כבר הופך ל-Date אם צריך
        idNumber,
        address,
      });

      const data = response.data;

      if (!data || !data.client) {
        setMessage(data.message || "Failed to create client");
        return;
      }

      setMessage("Client created successfully");

      // ניקוי הטופס
      setNewName("");
      setNewGoals("");
      setNewNotes("");
      setNewUsername("");
      setNewPassword("");
      setBirthDate("");
      setIdNumber("");
      setAddress("");

      // חזרה לרשימת הלקוחות
      navigate("/coach");
    } catch (error) {
      console.error("Error creating client:", error);
      if (error.response) {
        setMessage(
          error.response.data?.message || "Server error while creating client"
        );
      } else {
        setMessage("Server error while creating client");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* סרגל עליון */}
      <header
        style={{
          backgroundColor: "#222",
          color: "#fff",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{ fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/coach")}
        >
          Fitness Coach – מאמן
        </div>

        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/coach")}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            לקוחות
          </button>
          <button
            onClick={() => navigate("/coach/create-client")}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#3498db",
              color: "#fff",
            }}
          >
            יצירת לקוח חדש
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#e74c3c",
              color: "#fff",
            }}
          >
            יציאה
          </button>
        </nav>
      </header>

      {/* תוכן המסך */}
      <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>יצירת לקוח חדש</h2>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>שם הלקוח:</label>
            <br />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Client name"
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>מטרות:</label>
            <br />
            <textarea
              rows={3}
              style={{
                width: "100%",
                padding: "6px",
                marginTop: "4px",
                resize: "vertical",
              }}
              value={newGoals}
              onChange={(e) => setNewGoals(e.target.value)}
              placeholder="Client goals"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>הערות נוספות:</label>
            <br />
            <textarea
              rows={3}
              style={{
                width: "100%",
                padding: "6px",
                marginTop: "4px",
                resize: "vertical",
              }}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Additional notes"
            />
          </div>

          {/* שדות פרטים אישיים */}
          <hr style={{ margin: "16px 0" }} />

          <h4>פרטים אישיים של הלקוח</h4>

          <div style={{ marginBottom: "10px" }}>
            <label>תאריך לידה:</label>
            <br />
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>תעודת זהות:</label>
            <br />
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="ID Number"
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>כתובת:</label>
            <br />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>

          <hr style={{ margin: "16px 0" }} />

          <h4>פרטי התחברות ללקוח (אופציונלי)</h4>

          <div style={{ marginBottom: "10px" }}>
            <label>Username ללקוח:</label>
            <br />
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="client username"
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>סיסמה ללקוח:</label>
            <br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="password"
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>

          <button
            onClick={handleCreateClient}
            style={{
              marginTop: "8px",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#2ecc71",
              color: "#fff",
            }}
          >
            שמירת לקוח חדש
          </button>

          {message && (
            <p style={{ marginTop: "10px", color: "#c0392b" }}>{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreateClient;
