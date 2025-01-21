// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define context
interface AuthContextType {
  user: any; // User data (can be more specific)
  token: string | null;
  login: (data: { token: string; admin: any; type: string }) => void; // The login function accepts the user data and token
  logout: () => void;
  isAuthenticated: boolean; // This will check if the user is authenticated
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to provide context value to children
interface AuthProviderProps {
  children: ReactNode; // Define 'children' prop type
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user");
    const storedType = localStorage.getItem("type");
    return storedUser
      ? { ...JSON.parse(storedUser), type: storedType || null }
      : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? storedToken.replace(/"/g, "") : null; // Remove quotes if they were stored
  });

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // Handle login
  const login = (data: { token: string; admin: any; type: string }) => {
    setUser({ ...data.admin, type: data.type });
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.admin)); // Store user data in localStorage
    localStorage.setItem("type", data.type);
    localStorage.setItem("token", `"Bearer ${data.token}"`); // Store token in localStorage
  };

  // Handle logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// // src/context/AuthContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from "react";

// // Define context
// interface AuthContextType {
//   user: any; // User data (can be more specific)
//   token: string | null;
//   login: (data: { token: string; admin: any; type: string }) => void; // The login function accepts the user data and token
//   logout: () => void;
//   isAuthenticated: boolean; // This will check if the user is authenticated
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // AuthProvider component to provide context value to children
// interface AuthProviderProps {
//   children: ReactNode; // Define 'children' prop type
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<any>(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedType = localStorage.getItem("type");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });
//   const [token, setToken] = useState<string | null>(() => {
//     const storedToken = localStorage.getItem("token");
//     return storedToken ? storedToken.replace(/"/g, "") : null; // Remove quotes if they were stored
//   });

//   // Check if the user is authenticated
//   const isAuthenticated = !!token;

//   // Handle login
//   const login = (data: { token: string; admin: any; type: string }) => {
//     setUser({ ...data.admin, type: data.type });
//     setToken(data.token);
//     localStorage.setItem("user", JSON.stringify(data.admin)); // Store user data in localStorage
//     localStorage.setItem("token", `"Bearer ${data.token}"`); // Store token in localStorage
//   };

//   // Handle logout
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token, login, logout, isAuthenticated }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
