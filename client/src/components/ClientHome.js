import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function ClientHome() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
        if (err.response) {
          setMessage(err.response.data?.message || "שגיאה בטעינת פרופיל");
        } else {
          setMessage("שגיאת שרת");
        }
      }
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        padding: "20px",
        direction: "rtl",
        fontFamily: "Arial",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* כותרת + יציאה */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>מסך לקוח</h2>
        <button onClick={handleLogout}>יציאה</button>
      </div>

      {/* כפתורי ניווט למסכים נוספים */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "8px",
          justifyContent: "flex-start",
        }}
      >
        <button onClick={() => navigate("/client/progress")}>
          עדכון מטרות ושבוע
        </button>
        <button onClick={() => navigate("/client/history")}>
          צפייה בהיסטוריה שבועית
        </button>
      </div>

      {/* תוכן ראשי */}
      {!user ? (
        <p style={{ marginTop: "20px" }}>{message || "טוען נתונים..."}</p>
      ) : (
        <>
          <p style={{ marginTop: "16px", textAlign: "right" }}>
            שלום, <strong>{user.username}</strong>
          </p>

          {/* תכנית אימונים ותפריט - שתי תיבות זו ליד זו */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: "260px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                background: "#f8f8f8",
                textAlign: "right",
              }}
            >
              <h3 style={{ marginTop: 0 }}>תכנית אימונים</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {user.trainingPlan ||
                  "המאמן עדיין לא הגדיר עבורך תכנית אימונים."}
              </p>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: "260px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                background: "#f8f8f8",
                textAlign: "right",
              }}
            >
              <h3 style={{ marginTop: 0 }}>תפריט תזונה</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {user.nutritionPlan ||
                  "המאמן עדיין לא הגדיר עבורך תפריט תזונה."}
              </p>
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

export default ClientHome;
