import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGoals, setEditGoals] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch client");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setClient(data);
        setEditName(data.name || "");
        setEditGoals(data.goals || "");
        setEditNotes(data.notes || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching client:", error);
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          goals: editGoals,
          notes: editNotes,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update client");
        return;
      }

      const updated = await response.json();
      setClient(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  if (loading) return <p>טוען...</p>;
  if (!client) return <p>לא נמצא לקוח</p>;

  return (
    <div style={{ padding: "16px" }}>
      <h2>פרטי לקוח</h2>

      {!isEditing ? (
        <>
          <p><strong>שם:</strong> {client.name}</p>
          {client.goals && <p><strong>מטרות:</strong> {client.goals}</p>}
          {client.notes && <p><strong>הערות:</strong> {client.notes}</p>}

          <button onClick={() => setIsEditing(true)}>
            עריכת לקוח
          </button>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <div>
            <label>שם:</label><br />
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>מטרות:</label><br />
            <textarea
              value={editGoals}
              onChange={(e) => setEditGoals(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label>הערות:</label><br />
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit">שמור</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            ביטול
          </button>
        </form>
      )}
    </div>
  );
}

export default ClientDetails;
