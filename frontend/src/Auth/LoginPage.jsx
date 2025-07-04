// src/Auth/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GlobalLoader from "../components/common/GlobalLoader";

const LoginPage = () => {
  // Get all necessary functions and states from AuthContext.
  const {
    login,
    isLoading,
    appTranslations,
    language,
    currentColors: colors,
  } = useAuth();

  const navigate = useNavigate();
  const translations =
    appTranslations[language]?.login || appTranslations.en.login;

  const [email, setEmail] = useState(
    () => localStorage.getItem("rememberedEmail") || ""
  );
  const [password, setPassword] = useState(""); // Password should be empty initially
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("rememberMe") === "true"
  );
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UPDATE: handleLogin function now connects to the API.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setError(""); // Clear previous errors

    // Call the login function from context.
    const result = await login(email, password);

    if (result.success) {
      // "Remember Me" logic
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }
      navigate("/"); // Redirect to home page on successful login
    } else {
      // Show error message from API on failed login
      setError(translations.loginError);
    }
  };

  return (
    <>
      {/* Show GlobalLoader component if global loading state is active */}
      {isLoading && <GlobalLoader />}

      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.lightGrayBg }}>
        <div
          className="p-8 rounded-lg shadow-lg w-full max-w-md m-4"
          style={{ backgroundColor: colors.pureWhite }}>
          <h1
            className="text-3xl font-semibold mb-6 text-center"
            style={{ color: colors.darkText }}>
            {translations.title}
          </h1>

          {error && (
            <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: colors.darkText }}>
                {translations.mailLabel}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: colors.pureWhite,
                  color: colors.darkText,
                  borderColor: colors.mediumGrayText,
                }}
                required
              />
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: colors.darkText }}>
                {translations.passwordLabel}
              </label>
              <div
                className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500"
                style={{ borderColor: colors.mediumGrayText }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-transparent focus:outline-none"
                  style={{ color: colors.darkText }}
                  required
                />
                <span
                  className="p-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: colors.mediumGrayText }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>

            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm select-none"
                style={{ color: colors.darkText }}>
                {translations.rememberMe}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading} // Disable button while loading
              className="w-full py-3 px-4 rounded-md font-medium text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.logoPrimaryBlue }}>
              {translations.loginButton}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
