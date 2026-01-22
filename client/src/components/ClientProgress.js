import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ClientProgress() {
  const [user, setUser] = useState(null);
  const [goalsText, setGoalsText] = useState("");
  const [weeklyWeight, setWeeklyWeight] = useState("");
  const [weeklyNote, setWeeklyNote] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/api/users/me");
        const data = res.data;
        setUser(data);
        setGoalsText(data.goalsText || "");
      } catch (err) {
        console.error("Error loading data:", err);
        if (err.response) {
          setMessage(err.response.data?.message || "שגיאה בטעינת הנתונים");
        } else {
          setMessage("שגיאת שרת");
        }
      }
    };

    fetchMe();
  }, []);

  const handleGoalsSave = async () => {
    setMessage("");

    try {
      const res = await api.put("/api/users/me", { goalsText });
      setUser(res.data);
      setMessage("המטרות נשמרו בהצלחה");
    } catch (err) {
      console.error("Error saving goals:", err);
      if (err.response) {
        setMessage(err.response.data?.message || "שגיאה בשמירת המטרות");
      } else {
        setMessage("שגיאת שרת");
      }
    }
  };

  const handleWeeklySubmit = async () => {
    setMessage("");

    try {
      const res = await api.post("/api/users/me/weekly-update", {
        weight: weeklyWeight ? Number(weeklyWeight) : null,
        note: weeklyNote,
      });

      setUser(res.data);
      setWeeklyWeight("");
      setWeeklyNote("");
      setMessage("העדכון השבועי נשמר בהצלחה");
    } catch (err) {
      console.error("Error saving weekly update:", err);
      if (err.response) {
        setMessage(err.response.data?.message || "שגיאה בשמירת העדכון השבועי");
      } else {
        setMessage("שגיאת שרת");
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        direction: "rtl",
        fontFamily: "Arial",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/client")}
        style={{ marginBottom: "16px" }}
      >
        חזרה למסך הבית
      </button>

      <h2 style={{ marginTop: 0, textAlign: "right" }}>
        עדכון מטרות ועדכון שבועי
      </h2>

      {!user ? (
        <p>{message || "טוען נתונים..."}</p>
      ) : (
        <>
          {/* מטרות הלקוח */}
          <div
            style={{
              marginTop: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              background: "#f8f8f8",
            }}
          >
            <h3 style={{ marginTop: 0 }}>המטרות שלי</h3>
            <textarea
              rows={6}
              style={{ width: "100%", textAlign: "right" }}
              value={goalsText}
              onChange={(e) => setGoalsText(e.target.value)}
              placeholder="כתוב כאן את המטרות שלך..."
            />
            <div style={{ marginTop: "8px", textAlign: "left" }}>
              <button onClick={handleGoalsSave}>שמירת מטרות</button>
            </div>
          </div>

          {/* עדכון שבועי */}
          <div
            style={{
              marginTop: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "12px",
              background: "#f8f8f8",
            }}
          >
            <h3 style={{ marginTop: 0 }}>עדכון שבועי</h3>

            <div style={{ marginBottom: "8px" }}>
              <label>משקל (ק״ג): </label>
              <input
                type="number"
                value={weeklyWeight}
                onChange={(e) => setWeeklyWeight(e.target.value)}
                style={{ marginRight: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label>הערות / איך עבר השבוע:</label>
              <br />
              <textarea
                rows={4}
                style={{ width: "100%", textAlign: "right" }}
                value={weeklyNote}
                onChange={(e) => setWeeklyNote(e.target.value)}
                placeholder="כתוב כאן איך עבר השבוע, תחושות, קשיים..."
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <button onClick={handleWeeklySubmit}>שמירת עדכון שבועי</button>
            </div>
          </div>

          {message && (
            <p style={{ marginTop: "16px", textAlign: "right" }}>{message}</p>
          )}
        </>
      )}
    </div>
  );
}

export default ClientProgress;
