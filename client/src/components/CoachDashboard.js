import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CoachDashboard() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/clients", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setClients(data);
    };

    fetchClients();
  }, []);

  return (
    <div>
      <h2>לקוחות</h2>
        <ul>
            {clients.map((client) => (
                <li key={client._id}>
                    <Link to={`/clients/${client._id}`}>
                        {client.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
  );
}

export default CoachDashboard;
