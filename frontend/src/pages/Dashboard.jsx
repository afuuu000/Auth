import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { role } = useContext(AuthContext);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {role}!</p>
    </div>
  );
};

export default Dashboard;
