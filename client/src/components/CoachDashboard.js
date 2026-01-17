import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function CoachDashboard() {
  const [clients, setClients] = useState([]);

  // שדות עבור יצירת לקוח חדש
  const [newName, setNewName] = useState("");
  const [newGoals, setNewGoals] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const navigate = useNavigate();
    
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // חזרה למסך ההתחברות
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
          console.error("Failed to fetch clients");
          return;
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
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
        }),
      });

      if (!response.ok) {
        console.error("Failed to create client");
        return;
      }

      const createdClient = await response.json();

      // מוסיפים לרשימה על המסך
      setClients((prev) => [...prev, createdClient]);

      // איפוס הטופס
      setNewName("");
      setNewGoals("");
      setNewNotes("");
    } catch (error) {
      console.error("Error creating client:", error);
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

      if (!response.ok) {
        console.error("Failed to delete client");
        return;
      }

      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (

    <div style={{ padding: "16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            <label>שם:</label><br />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>מטרות:</label><br />
            <textarea
              value={newGoals}
              onChange={(e) => setNewGoals(e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label>הערות:</label><br />
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={2}
            />
          </div>

          <button type="submit" style={{ marginTop: "8px" }}>
            שמירת לקוח
          </button>
        </form>
      </div>

      {/* רשימת לקוחות קיימים */}
      <ul>
        {clients.map((client) => (
          <li key={client._id}>
            <Link to={`/clients/${client._id}`}>{client.name}</Link>{" "}
            <button onClick={() => handleDelete(client._id)}>מחיקה</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoachDashboard;
