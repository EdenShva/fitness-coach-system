import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ClientHistory() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      setMessage("");

      try {
        const res = await api.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error loading history:", err);
        if (err.response) {
          setMessage(err.response.data?.message || "Failed to load history");
        } else {
          setMessage("Server error");
        }
      }
    };

    fetchMe();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("he-IL");
  };

  return (
    <div style={{ padding: "16px", direction: "rtl", fontFamily: "Arial" }}>
      <button onClick={() => navigate("/client")}>חזרה למסך הלקוח</button>

      <h2 style={{ marginTop: "16px" }}>היסטוריה שבועית</h2>

      {user ? (
        <>
          {user.weeklyUpdates && user.weeklyUpdates.length > 0 ? (
            <ul style={{ marginTop: "16px" }}>
              {user.weeklyUpdates.map((update, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  <strong>{formatDate(update.date)}:</strong>{" "}
                  {update.weight && <span>{update.weight} ק״ג – </span>}
                  {update.note}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ marginTop: "16px" }}>אין עדיין עדכונים שבועיים.</p>
          )}
        </>
      ) : (
        <p>{message || "טוען היסטוריה..."}</p>
      )}
    </div>
  );
}

export default ClientHistory;
