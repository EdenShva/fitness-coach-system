import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/api/clients");
        setClients(response.data || []);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        if (error.response) {
          setMessage(
            error.response.data?.message || "Failed to fetch clients"
          );
        } else {
          setMessage("Server error while fetching clients");
        }
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    setMessage("");

    try {
      await api.delete(`/api/clients/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
      setMessage("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      if (error.response) {
        setMessage(
          error.response.data?.message || "Server error while deleting client"
        );
      } else {
        setMessage("Server error while deleting client");
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
        {/* לוגו / שם מערכת */}
        <div
          style={{ fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/coach")}
        >
          Fitness Coach – מאמן
        </div>

        {/* תפריט ניווט */}
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

      {/* תוכן הדף */}
      <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <h2>רשימת הלקוחות שלי</h2>

        {clients.length === 0 ? (
          <p>אין עדיין לקוחות במערכת.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {clients.map((client) => {
              const clientUserId = client.user || client._id;
              return (
                <li
                  key={client._id}
                  style={{
                    backgroundColor: "#fff",
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>{client.name}</div>
                    {client.goals && (
                      <div style={{ fontSize: "12px", color: "#555" }}>
                        {client.goals}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/clients/${clientUserId}`)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      פרטים
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                      }}
                    >
                      מחיקה
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {message && (
          <p style={{ marginTop: "10px", color: "#c0392b" }}>{message}</p>
        )}
      </main>
    </div>
  );
}

export default CoachDashboard;
