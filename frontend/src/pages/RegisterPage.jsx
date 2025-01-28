import React, { useState } from "react";
import { registerUser } from "../services/api";
import "../styles/Auth.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "User" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setMessage(response.data.message); // Successful registration message
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <select onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
          <option value="SuperAdmin">SuperAdmin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;
