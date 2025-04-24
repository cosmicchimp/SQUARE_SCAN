// context/AuthContext.js
import { createContext, useState } from "react";

// Create Context
export const AuthContext = createContext();

// Create Context Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, AuthenticateUser] = useState(true); // Default is false (not authenticated)
  const [currentUser, setCurrentUser] = useState("");
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, AuthenticateUser, currentUser, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
