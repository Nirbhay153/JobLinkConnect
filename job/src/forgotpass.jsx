import React, { useState } from "react";
import "./forgotpass.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setIsError(false);
        setMessage("A password recovery email has been sent to your email address.");
      } else {
        setIsError(true);
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setIsError(true);
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="forgot-input"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="forgot-btn" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Recover Password"}
        </button>
      </form>

      {message && (
        <p className={`forgot-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;