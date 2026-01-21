import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ClientDetails() {
  const { id } = useParams(); // זה ה-id של המשתמש-לקוח (User._id)
  const navigate = useNavigate();

  const [clientInfo, setClientInfo] = useState(null);
  const [trainingPlan, setTrainingPlan] = useState("");
  const [nutritionPlan, setNutritionPlan] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
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
          setClientInfo(data); // { clientId, username, goalsText, trainingPlan, nutritionPlan, weeklyUpdates: [...] }
          setTrainingPlan(data.trainingPlan || "");
          setNutritionPlan(data.nutritionPlan || "");
        } else {
          setMessage(data.message || "Failed to load client data");
        }
      } catch (err) {
        console.error("Error fetching client data:", err);
        setMessage("Server error");
      }
    };

    fetchClientData();
  }, [id]);

  const handleBack = () => {
    navigate("/coach");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("he-IL");
  };

  const handleSavePlans = async () => {
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/client/${id}/plans`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ trainingPlan, nutritionPlan }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Plans saved successfully");
      } else {
        setMessage(data.message || "Failed to save plans");
      }
    } catch (err) {
      console.error("Error saving plans:", err);
      setMessage("Server error");
    }
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

          {clientInfo.goalsText && (
            <div style={{ marginTop: "12px", maxWidth: "600px" }}>
              <h3>Client Goals / Notes</h3>
              <p>{clientInfo.goalsText}</p>
            </div>
          )}

          {/* עריכת תכנית אימונים ותפריט */}
          <div style={{ marginTop: "20px", maxWidth: "700px" }}>
            <h3>Training Plan</h3>
            <textarea
              rows={6}
              style={{ width: "100%" }}
              value={trainingPlan}
              onChange={(e) => setTrainingPlan(e.target.value)}
              placeholder="Write the training plan for this client..."
            />

            <h3 style={{ marginTop: "16px" }}>Nutrition Plan</h3>
            <textarea
              rows={6}
              style={{ width: "100%" }}
              value={nutritionPlan}
              onChange={(e) => setNutritionPlan(e.target.value)}
              placeholder="Write the nutrition plan for this client..."
            />

            <button style={{ marginTop: "12px" }} onClick={handleSavePlans}>
              Save Plans
            </button>
          </div>

          {/* היסטוריית עדכונים שבועיים */}
          <div style={{ marginTop: "24px", maxWidth: "700px" }}>
            <h3>Weekly Updates</h3>
            {clientInfo.weeklyUpdates && clientInfo.weeklyUpdates.length > 0 ? (
              <ul>
                {clientInfo.weeklyUpdates.map((update, index) => (
                  <li key={index}>
                    <strong>{formatDate(update.date)}:</strong>{" "}
                    {update.weight && <span>{update.weight} kg – </span>}
                    {update.note}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No weekly updates yet for this client.</p>
            )}
          </div>

          {message && <p>{message}</p>}
        </>
      ) : (
        <p>{message || "Loading client data..."}</p>
      )}
    </div>
  );
}

export default ClientDetails;
