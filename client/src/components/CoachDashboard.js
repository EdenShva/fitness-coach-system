import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState("");

  // שדות עבור יצירת לקוח חדש
  const [newName, setNewName] = useState("");
  const [newGoals, setNewGoals] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/clients", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setMessage(data.message || "Failed to fetch clients");
          console.error("Failed to fetch clients");
          return;
        }

        const data = await response.json();
        setClients(data);
        setMessage("");
      } catch (error) {
        console.error("Error fetching clients:", error);
        setMessage("Server error while fetching clients");
      }
    };

    fetchClients();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          goals: newGoals,
          notes: newNotes,
          username: newUsername,
          password: newPassword,
        }),
      });

      const createdClient = await response.json();

      if (!response.ok) {
        setMessage(createdClient.message || "Failed to create client");
        console.error("Failed to create client");
        return;
      }

      // מוסיפים לרשימה על המסך
      setClients((prev) => [...prev, createdClient]);

      // איפוס הטופס
      setNewName("");
      setNewGoals("");
      setNewNotes("");
      setMessage("Client created successfully");
    } catch (error) {
      console.error("Error creating client:", error);
      setMessage("Server error while creating client");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את הלקוח הזה?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "Failed to delete client");
        console.error("Failed to delete client");
        return;
      }

      setClients((prev) => prev.filter((c) => c._id !== id));
      setMessage("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      setMessage("Server error while deleting client");
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>לקוחות</h2>
        <button onClick={handleLogout}>יציאה</button>
      </div>

      {/* טופס יצירת לקוח חדש */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "12px",
          marginBottom: "16px",
          maxWidth: "400px",
        }}
      >
        <h3>הוספת לקוח חדש</h3>
        <form onSubmit={handleCreate}>
          <div>
            <label>שם:</label>
            <br />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>מטרות:</label>
            <br />
            <textarea
              value={newGoals}
              onChange={(e) => setNewGoals(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label>הערות:</label>
            <br />
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label>שם משתמש ללקוח:</label><br />
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>

          <div>
            <label>סיסמה ללקוח:</label><br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>


          <button type="submit" style={{ marginTop: "8px" }}>
            שמירת לקוח
          </button>
        </form>
      </div>

      {/* רשימת לקוחות קיימים */}
      <h3>רשימת לקוחות</h3>
      {clients.length === 0 ? (
        <p>אין לקוחות עדיין.</p>
      ) : (
        <ul>
          {clients.map((client) => {
            // 👇 כאן הקסם: ננסה קודם user / userId, ואם אין – נשתמש ב-_id
            const clientUserId = client.user || client.userId || client._id;

            return (
              <li key={client._id} style={{ marginBottom: "8px" }}>
                {/* ניווט למסך פרטי לקוח */}
                <Link to={`/clients/${clientUserId}`}>{client.name}</Link>{" "}
                <button onClick={() => handleDelete(client._id)}>מחיקה</button>
              </li>
            );
          })}
        </ul>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default CoachDashboard;
