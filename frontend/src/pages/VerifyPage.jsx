import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../services/api";

const VerifyPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setMessage(response.data.message); // Display successful verification message
      } catch (err) {
        setMessage(err.response?.data?.error || "Something went wrong!"); // Error handling
      }
    };
    verify();
  }, [token]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyPage;
