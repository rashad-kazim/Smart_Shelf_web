// useAuth.js
// Custom authentication hook
// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook created to use AuthContext more easily in components.
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Checks if this hook is used outside of an AuthProvider and throws an error.
  // This allows us to catch possible errors early.
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
