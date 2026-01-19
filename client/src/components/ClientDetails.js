import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ClientDetails() {
  const { id } = useParams(); // זה יהיה ה-id של המשתמש-לקוח (User._id)
  const navigate = useNavigate();

  const [clientInfo, setClientInfo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClientWeeklyUpdates = async () => {
      setMessage("");
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:5000/api/users/client/${id}/weekly-updates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setClientInfo(data); // { clientId, username, weeklyUpdates: [...] }
        } else {
          setMessage(data.message || "Failed to load client data");
        }
      } catch (err) {
        console.error("Error fetching client weekly updates:", err);
        setMessage("Server error");
      }
    };

    fetchClientWeeklyUpdates();
  }, [id]);

  const handleBack = () => {
    navigate("/coach");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("he-IL");
  };

  return (
    <div style={{ padding: "16px" }}>
      <button onClick={handleBack}>Back to Clients</button>

      <h2 style={{ marginTop: "16px" }}>Client Details</h2>

      {clientInfo ? (
        <>
          <p>
            <strong>Username:</strong> {clientInfo.username}
          </p>

          <div style={{ marginTop: "16px", maxWidth: "600px" }}>
            <h3>Weekly Updates</h3>
            {clientInfo.weeklyUpdates && clientInfo.weeklyUpdates.length > 0 ? (
              <ul>
                {clientInfo.weeklyUpdates
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((item, index) => (
                    <li key={item._id || index} style={{ marginBottom: "8px" }}>
                      <strong>{formatDate(item.date)}:</strong>{" "}
                      {item.weight ? `${item.weight} kg` : "No weight"}{" "}
                      {item.note ? `– ${item.note}` : ""}
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No weekly updates yet for this client.</p>
            )}
          </div>
        </>
      ) : (
        <p>{message || "Loading client data..."}</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default ClientDetails;
