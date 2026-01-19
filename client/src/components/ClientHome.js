import React, { useEffect, useState } from "react";

function ClientHome() {
  const [user, setUser] = useState(null);
  const [goalsText, setGoalsText] = useState("");
  const [weeklyWeight, setWeeklyWeight] = useState("");
  const [weeklyNote, setWeeklyNote] = useState("");
  const [message, setMessage] = useState("");

  // Fetch logged-in user data
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setGoalsText(data.goalsText || "");
      } else {
        setMessage(data.message || "Failed to load profile");
      }
    };

    fetchMe();
  }, []);

  // Save goals / feedback
  const handleSave = async () => {
    setMessage("");
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goalsText }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data);
      setMessage("Goals saved!");
    } else {
      setMessage(data.message || "Failed to save goals");
    }
  };

  // Submit weekly update
  const handleWeeklySubmit = async () => {
    setMessage("");
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/users/me/weekly-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weight: weeklyWeight ? Number(weeklyWeight) : null,
        note: weeklyNote,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data);
      setWeeklyWeight("");
      setWeeklyNote("");
      setMessage("Weekly update saved!");
    } else {
      setMessage(data.message || "Failed to save weekly update");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Client Home</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {user ? (
        <>
          <p>Welcome, {user.username}</p>

          {/* Goals section */}
          <div style={{ marginTop: "16px", maxWidth: "600px" }}>
            <h3>Goals / Feedback</h3>
            <textarea
              rows={6}
              style={{ width: "100%" }}
              value={goalsText}
              onChange={(e) => setGoalsText(e.target.value)}
              placeholder="Write your goals, allergies, preferences, target weight..."
            />
            <button style={{ marginTop: "8px" }} onClick={handleSave}>
              Save Goals
            </button>
          </div>

          {/* Weekly update section */}
          <div style={{ marginTop: "20px", maxWidth: "600px" }}>
            <h3>Weekly Update</h3>

            <input
              type="number"
              placeholder="Weight (kg)"
              value={weeklyWeight}
              onChange={(e) => setWeeklyWeight(e.target.value)}
            />

            <div style={{ marginTop: "8px" }}>
              <textarea
                rows={4}
                style={{ width: "100%" }}
                placeholder="Weekly note / feedback"
                value={weeklyNote}
                onChange={(e) => setWeeklyNote(e.target.value)}
              />
            </div>

            <button style={{ marginTop: "8px" }} onClick={handleWeeklySubmit}>
              Submit Weekly Update
            </button>
          </div>

          {message && <p>{message}</p>}
        </>
      ) : (
        <p>{message || "Loading..."}</p>
      )}
    </div>
  );
}

export default ClientHome;
