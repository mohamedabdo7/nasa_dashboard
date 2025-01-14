import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LoginPayload } from "../../../types/login";
import { routes } from "../../../constants";
import { loginIcon } from "../../../assets/icons";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { loginService } from "../../../services"; // Import the refactored login service

enum UserType {
  Admin = "Admin",
  Employee = "Employee",
  Consultant = "Consultant",
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState<UserType | undefined>(undefined); // No default selection
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!userType) {
      setError("Please select a user type.");
      return;
    }

    setError("");
    setIsLoading(true);

    const payload: LoginPayload = {
      email,
      password,
      type: userType, // Selected user type
    };

    try {
      const response = await loginService(payload); // Dynamically call the right service
      if (response?.token) {
        login(response);

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        navigate(routes.EMPLOYEES);
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
      <div className="login-box">
        <img src={loginIcon} alt="login" style={{ width: "300px" }} />
        <form onSubmit={handleSubmit}>
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

          {/* User Type Selection */}
          <div className="user-type-group">
            <label className="text-primary">{t("inputs.userType")}</label>
            <div
              className="radio-group"
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <label className="flex items-center space-x-2 text-primary">
                <input
                  type="radio"
                  name="userType"
                  value={UserType.Admin}
                  checked={userType === UserType.Admin}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="form-radio text-primary focus:ring-primary"
                />
                <span>{t("inputs.admin")}</span>
              </label>

              <label className="flex items-center space-x-2 text-primary">
                <input
                  type="radio"
                  name="userType"
                  value={UserType.Employee}
                  checked={userType === UserType.Employee}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="form-radio text-primary focus:ring-primary"
                />
                <span>{t("inputs.employee")}</span>
              </label>

              <label className="flex items-center space-x-2 text-primary">
                <input
                  type="radio"
                  name="userType"
                  value={UserType.Consultant}
                  checked={userType === UserType.Consultant}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="form-radio text-primary focus:ring-primary"
                />
                <span>{t("inputs.consultant")}</span>
              </label>
            </div>
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

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // For redirection
// import "./Login.scss"; // Import styles for the login component
// import { useAuth } from "../../../context/AuthContext";
// import { LoginPayload } from "../../../types/login";
// import { routes } from "../../../constants";
// import { loginIcon } from "../../../assets/icons";
// import { useTranslation } from "react-i18next";
// import { Spinner } from "react-bootstrap";
// import { AdminloginService } from "../../../services";

// enum UserType {
//   Admin = "Admin",
//   Employee = "Employee",
//   Consultant = "Consultant",
// }

// const Login: React.FC = () => {
//   const { login } = useAuth(); // Extract login method from context (to store user data after login)
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [email, setEmail] = useState(""); // State for email (username)
//   const [password, setPassword] = useState(""); // State for password
//   const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
//   const [userType, setUserType] = useState<UserType>(UserType.Admin); // State for user type
//   const [error, setError] = useState(""); // To display error message if login fails
//   const [isLoading, setIsLoading] = useState(false); // Loading state for login submission

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate input
//     if (!email || !password) {
//       setError("Email and password are required.");
//       return;
//     }

//     setError(""); // Clear any previous error
//     setIsLoading(true); // Set loading state to true while awaiting the login API call

//     // Prepare login payload
//     const payload: LoginPayload = {
//       email: email,
//       password: password,
//       type: userType, // Set the selected user type
//     };

//     try {
//       const response: any = await AdminloginService(payload); // Call the login service
//       console.log("response", response);
//       if (response?.token) {
//         // Successful login
//         login(response); // Store user data and token in context

//         // Store email in localStorage if "Remember Me" is checked
//         if (rememberMe) {
//           localStorage.setItem("rememberedEmail", email);
//         } else {
//           localStorage.removeItem("rememberedEmail");
//         }

//         navigate(routes.EMPLOYEES);
//       } else {
//         // Handle failed login (e.g., invalid credentials)
//         setError("Invalid credentials. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       setError("Something went wrong. Please try again later.");
//     } finally {
//       setIsLoading(false); // Set loading state to false after the login attempt
//     }
//   };

//   // Load remembered email if available
//   React.useEffect(() => {
//     const rememberedEmail = localStorage.getItem("rememberedEmail");
//     if (rememberedEmail) {
//       setEmail(rememberedEmail);
//       setRememberMe(true);
//     }
//   }, []);

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <img src={loginIcon} alt="login" style={{ width: "300px" }} />
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label htmlFor="email">{t("inputs.email")}</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder={t("placeholder.emailSymbol")}
//             />
//           </div>
//           <div className="input-group">
//             <label htmlFor="password">{t("inputs.password")}</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder={t("placeholder.password")}
//             />
//           </div>
//           {/* User Type Selection */}
//           <div className="user-type-group">
//             <label>{t("inputs.userType")}</label>
//             <div className="radio-group">
//               <label>
//                 <input
//                   type="radio"
//                   name="userType"
//                   value={UserType.Admin}
//                   checked={userType === UserType.Admin}
//                   onChange={(e) => setUserType(e.target.value as UserType)}
//                 />
//                 {t("inputs.admin")}
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="userType"
//                   value={UserType.Employee}
//                   checked={userType === UserType.Employee}
//                   onChange={(e) => setUserType(e.target.value as UserType)}
//                 />
//                 {t("inputs.employee")}
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="userType"
//                   value={UserType.Consultant}
//                   checked={userType === UserType.Consultant}
//                   onChange={(e) => setUserType(e.target.value as UserType)}
//                 />
//                 {t("inputs.consultant")}
//               </label>
//             </div>
//           </div>
//           <div className="remember-forgot">
//             <label className="remember-me">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               {t("inputs.rememberMe")}
//             </label>
//             <label
//               className="forgot-password-link"
//               onClick={() => navigate(routes.FORGET_PASSWORD)}
//             >
//               {t("inputs.forgotPassword")}
//             </label>
//           </div>
//           {error && <p className="error-message">{error}</p>}{" "}
//           {/* Display error message */}
//           <button type="submit" className="login-btn" disabled={isLoading}>
//             {isLoading ? <Spinner animation="border" /> : t("buttons.signIn")}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // For redirection
// import "./Login.scss"; // Import styles for the login component
// import { useAuth } from "../../../context/AuthContext";
// import { LoginPayload } from "../../../types/login";
// import { routes } from "../../../constants";
// import { loginIcon } from "../../../assets/icons";
// import { useTranslation } from "react-i18next";
// import { Spinner } from "react-bootstrap";
// import { AdminloginService } from "../../../services";

// const Login: React.FC = () => {
//   const { login } = useAuth(); // Extract login method from context (to store user data after login)
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   const [email, setEmail] = useState(""); // State for email (username)
//   const [password, setPassword] = useState(""); // State for password
//   const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
//   const [error, setError] = useState(""); // To display error message if login fails
//   const [isLoading, setIsLoading] = useState(false); // Loading state for login submission

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate input
//     if (!email || !password) {
//       setError("Email and password are required.");
//       return;
//     }

//     setError(""); // Clear any previous error
//     setIsLoading(true); // Set loading state to true while awaiting the login API call

//     // Prepare login payload
//     const payload: LoginPayload = {
//       email: email, // Use email for the login
//       password: password,
//       type: "Admin",
//     };

//     try {
//       const response: any = await AdminloginService(payload); // Call the login service
//       console.log("response", response);
//       if (response?.token) {
//         // Successful login
//         login(response); // Store user data and token in context

//         // Store email in localStorage if "Remember Me" is checked
//         if (rememberMe) {
//           localStorage.setItem("rememberedEmail", email);
//         } else {
//           localStorage.removeItem("rememberedEmail");
//         }

//         navigate(routes.EMPLOYEES);
//       } else {
//         // Handle failed login (e.g., invalid credentials)
//         setError("Invalid credentials. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       setError("Something went wrong. Please try again later.");
//     } finally {
//       setIsLoading(false); // Set loading state to false after the login attempt
//     }
//   };

//   // Load remembered email if available
//   React.useEffect(() => {
//     const rememberedEmail = localStorage.getItem("rememberedEmail");
//     if (rememberedEmail) {
//       setEmail(rememberedEmail);
//       setRememberMe(true);
//     }
//   }, []);

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <img src={loginIcon} alt="login" style={{ width: "300px" }} />
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label htmlFor="email">{t("inputs.email")}</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder={t("placeholder.emailSymbol")}
//             />
//           </div>
//           <div className="input-group">
//             <label htmlFor="password">{t("inputs.password")}</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder={t("placeholder.password")}
//             />
//           </div>
//           <div className="remember-forgot ">
//             <label className="remember-me">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//               />
//               {t("inputs.rememberMe")}
//             </label>
//             <label
//               className="forgot-password-link"
//               onClick={() => navigate(routes.FORGET_PASSWORD)}
//             >
//               {t("inputs.forgotPassword")}
//             </label>
//           </div>
//           {error && <p className="error-message">{error}</p>}{" "}
//           {/* Display error message */}
//           <button type="submit" className="login-btn" disabled={isLoading}>
//             {isLoading ? <Spinner animation="border" /> : t("buttons.signIn")}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
