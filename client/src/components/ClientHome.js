import React from "react";

function ClientHome() {
  return (
    <div style={{ padding: "16px" }}>
      <h2>מסך לקוח</h2>
      <p>ברוכה הבאה! כאן בעתיד יוצגו התפריט, האימונים והמעקב השבועי שלך.</p>

      <div
        style={{
          marginTop: "16px",
          border: "1px solid #ccc",
          padding: "12px",
          maxWidth: "500px",
        }}
      >
        <h3>מטרות / פידבק</h3>
        <p>בשלב זה זהו מסך תצוגה בסיסי. בהמשך נוסיף כאן עריכה ונתונים אמיתיים.</p>
      </div>
    </div>
  );
}

export default ClientHome;
