import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"; // For redirection and accessing state
import "./Login/Login.scss"; // Reuse login styles
import { routes } from "../../constants";
import { loginIcon } from "../../assets/icons";
import { forgetPasswordService, sendOtpService } from "../../services"; // Import services

const OtpComponent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the email from the navigation state
  const { email } = location.state || { email: null };

  const [otp, setOtp] = useState(""); // State for OTP input
  const [error, setError] = useState(""); // State for errors
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [timer, setTimer] = useState(60); // Countdown timer state
  const [isResendDisabled, setIsResendDisabled] = useState(true); // State for disabling resend functionality

  const handleChange = (otp: string) => {
    setOtp(otp); // Update OTP value
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6 || timer === 0) {
      setError(t("errors.otpInvalid")); // Show error if OTP is incomplete or time is up
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Call the verify OTP service
      const response = await sendOtpService({ email, otp });
      console.log("OTP Verified:", response);
      // navigate(routes.RESET_PASSWORD); // Navigate to the reset password page
      navigate(routes.RESET_PASSWORD, { state: { email, otp } });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(60); // Reset the timer
    setIsResendDisabled(true); // Disable the resend button

    try {
      // Call the resend OTP service
      const response = await forgetPasswordService({ email });
      console.log("OTP Resent:", response);
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again later.");
    }
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false); // Enable the resend button when the timer reaches 0
    }
  }, [timer]);

  if (!email) {
    // If no email is provided, redirect to the Forget Password page
    navigate(routes.FORGET_PASSWORD);
    return null;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={loginIcon} alt="otp" style={{ width: "300px" }} />
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
            color: "var(--primary)",
          }}
        >
          {t("inputs.emailMsg")}
        </h6>
        <h6
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--primary)",
            margin: "0 0 1rem 0",
          }}
        >
          {email}
        </h6>{" "}
        {/* Render the email here */}
        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6} // Number of OTP digits
              inputStyle={{
                width: "50px",
                height: "50px",
                margin: "0 0.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                textAlign: "center",
                fontSize: "18px",
                outline: "none",
              }}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error */}
          <p className="timer mt-3 mb-0">
            {timer > 0 ? (
              <span>
                00:{timer.toString().padStart(2, "0")} {/* Display timer */}
              </span>
            ) : (
              <>
                <span>
                  Didn’t receive code ?{" "}
                  <button
                    className="resend-btn btn btn-link"
                    onClick={handleResend}
                    disabled={isResendDisabled}
                  >
                    {t("inputs.resend")}
                  </button>
                </span>
              </>
            )}
          </p>
          <button
            type="submit"
            className="login-btn"
            disabled={otp.length !== 6 || timer === 0 || isLoading}
          >
            {isLoading ? <Spinner animation="border" /> : t("buttons.confirm")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpComponent;
