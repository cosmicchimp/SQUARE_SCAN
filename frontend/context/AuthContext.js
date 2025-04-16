// context/AuthContext.js
import { createContext, useState } from "react";

// Create Context
export const AuthContext = createContext();

// Create Context Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, AuthenticateUser] = useState(false); // Default is false (not authenticated)

  return (
    <AuthContext.Provider value={{ isAuthenticated, AuthenticateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
