import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setMessage(response.data.message);

        // Redirect to login page if verification is successful
        if (response.data.redirect) {
          setTimeout(() => navigate(response.data.redirect), 3000);
        }
      } catch (err) {
        setMessage("Verification failed. Try again.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">Email Verification</h2>
      <p className="text-gray-700">{message}</p>
    </div>
  );
};

export default VerifyPage;
