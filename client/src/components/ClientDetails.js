import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

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

      try {
        const res = await api.get(`/api/users/client/${id}/weekly-updates`);
        const data = res.data;

        // data: { clientId, username, goalsText, trainingPlan, nutritionPlan, weeklyUpdates: [...] }
        setClientInfo(data);
        setTrainingPlan(data.trainingPlan || "");
        setNutritionPlan(data.nutritionPlan || "");
      } catch (err) {
        console.error("Error fetching client data:", err);
        if (err.response) {
          setMessage(err.response.data?.message || "Failed to load client data");
        } else {
          setMessage("Server error");
        }
      }
    };

    fetchClientData();
  }, [id]);

  const handleSavePlans = async () => {
    setMessage("");

    try {
      const res = await api.put(`/api/users/client/${id}/plans`, {
        trainingPlan,
        nutritionPlan,
      });

      const data = res.data;
      setMessage("Plans saved successfully");

      setTrainingPlan(data.trainingPlan || trainingPlan);
      setNutritionPlan(data.nutritionPlan || nutritionPlan);
    } catch (err) {
      console.error("Error saving plans:", err);
      if (err.response) {
        setMessage(err.response.data?.message || "Failed to save plans");
      } else {
        setMessage("Server error");
      }
    }
  };

  const handleBack = () => {
    navigate("/coach");
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

            <div style={{ marginTop: "8px" }}>
              <button onClick={handleSavePlans}>Save Plans</button>
            </div>
          </div>

          {/* היסטוריה שבועית */}
          <div style={{ marginTop: "24px" }}>
            <h3>Weekly Updates</h3>
            {clientInfo.weeklyUpdates && clientInfo.weeklyUpdates.length > 0 ? (
              <ul>
                {clientInfo.weeklyUpdates.map((update, index) => (
                  <li key={index}>
                    {new Date(update.date).toLocaleDateString("he-IL")} -{" "}
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
