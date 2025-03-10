import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LoginPayload } from "../../../types/login";
import { routes } from "../../../constants";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { loginService } from "../../../services";
import SingleSelect from "../../../components/UI/Multi-Select/SingleSelect";

enum UserType {
  Admin = "Admin",
  Employee = "Employee",
  Consultant = "Consultant",
}

const Login: React.FC = () => {
  // const { user } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userTypeOptions = [
    { label: t("inputs.admin"), value: UserType.Admin },
    { label: t("inputs.employee"), value: UserType.Employee },
    { label: t("inputs.consultant"), value: UserType.Consultant },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!selectedType) {
      setError("Please select a user type.");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload: LoginPayload = {
      email,
      password,
      type: selectedType.value, // Use value from selectedType
    };

    try {
      const response = await loginService(payload);
      if (response?.token) {
        login(response);
        setError(""); // Clear errors on success
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        navigate(
          response.type === UserType.Admin ? routes.EMPLOYEES : routes.PROJECTS
        );
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box w-100 d-flex flex-column  justify-content-center">
        <div>
          <img
            src={"https://nasagulf.com/uploads/logo/-2-1616668986.WebP"}
            alt="login"
            style={{ width: "300px", height: "auto" }}
          />
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          {/* User Type Selection */}
          <div className="user-type-group my-3">
            {/* <label className="text-primary">{t("inputs.userType")}</label> */}
            <SingleSelect
              required
              options={userTypeOptions}
              placeholder={t("placeholder.userType")}
              labelName={t("inputs.userType")}
              value={selectedType}
              onChange={(option) => {
                setSelectedType(option);
              }}
              name="userType"
              isSearchable={false}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">{t("inputs.email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder.emailSymbol")}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">{t("inputs.password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("placeholder.password")}
            />
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              {t("inputs.rememberMe")}
            </label>
            <label
              className="forgot-password-link"
              onClick={() => navigate(routes.FORGET_PASSWORD)}
            >
              {t("inputs.forgotPassword")}
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" /> : t("buttons.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
