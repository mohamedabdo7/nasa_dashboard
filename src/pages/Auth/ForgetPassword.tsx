import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import "./Login/Login.scss";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { ForgetPasswordPayload } from "../../types/login";
import { forgetPasswordService } from "../../services";
import { loginIcon } from "../../assets/icons";
import { routes } from "../../constants";

const ForgetPassword: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState(""); // State for email input
  const [error, setError] = useState(""); // For error messages
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [successMessage, setSuccessMessage] = useState(""); // For success feedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!email) {
      setError("Email is required.");
      return;
    }

    setError(""); // Clear any previous error
    setIsLoading(true); // Show loading spinner during API call
    setSuccessMessage(""); // Clear success message

    const payload: ForgetPasswordPayload = { email };

    try {
      await forgetPasswordService(payload);
      //   const serverMessage = response.data.message;
      //   setSuccessMessage(serverMessage); // Display success message
      navigate(routes.OTP, { state: { email } });
    } catch (error) {
      console.error("Error in forgot password process:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={loginIcon} alt="login" style={{ width: "300px" }} />
        <h5
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "var(--primary)",
          }}
        >
          {t("inputs.forgotPassword")}
        </h5>
        <h6
          style={{
            fontSize: "16px",
            fontWeight: "400",
            margin: "0.8rem 0",
          }}
        >
          {t("inputs.enterEmailToSendOTP")}
        </h6>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">{t("inputs.email")} *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder.emailSymbol")}
            />
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error */}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}{" "}
          {/* Display success message */}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" /> : t("buttons.send")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
