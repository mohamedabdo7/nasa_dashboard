import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation and accessing state
import "./Login/Login.scss"; // Reuse login styles
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { updatePassword } from "../../services";
import { loginIcon } from "../../assets/icons";
import { routes } from "../../constants";
import { showToast } from "../../utils";

const NewPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Retrieve email and otp from navigation state
  const { email, otp } = location.state || { email: null, otp: null };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload = {
      email,
      otp,
      password,
      confirmPassword,
    };

    try {
      await updatePassword(payload);
      showToast("Password updated successfully!", "success");
      navigate(routes.SIGNIN); // Navigate to the login page after success
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !otp) {
    // Redirect to Forget Password page if email or otp is missing
    navigate(routes.FORGET_PASSWORD);
    return null;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={loginIcon} alt="New Password" style={{ width: "300px" }} />
        <h5
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "var(--primary)",
          }}
        >
          {t("inputs.newPassword")}
        </h5>
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="input-group">
            <label htmlFor="password">{t("inputs.newPassword")} *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create your new password."
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">
              {t("inputs.confirmPassword")} *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password."
            />
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error */}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" /> : t("buttons.save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
