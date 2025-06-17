// src/pages/Auth/LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { mockUsers } from "../../data/mockUsers";
import { mockCompanyUsers } from "../../data/mockCompanyUsers";

const LoginPage = ({ appTranslations, currentColors }) => {
  const [email, setEmail] = useState(
    () => localStorage.getItem("rememberedEmail") || ""
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem("rememberedPassword") || ""
  );
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("rememberMe") === "true"
  );
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // We get the correct translation object to be compatible with language change
  const translations =
    appTranslations[localStorage.getItem("language") || "en"]?.login || {};

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  }, [rememberMe]);

  const handleLogin = () => {
    setError("");
    // Admin Login
    if (email === "kresad555@gmail.com" && password === "Admin448.") {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      login({
        email: email,
        role: ROLES.ADMIN,
        name: "Kresad",
        surname: "Developer",
        country: "Global",
        dob: "1990-01-01",
      });
      navigate("/");
      return;
    }

    // Supermarket User Login Attempt
    const supermarketUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (supermarketUser) {
      setError(translations.mobileOnlyAccess);
      return;
    }

    // Company User Login Attempt
    const companyUser = mockCompanyUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (companyUser) {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      login({ ...companyUser });
      navigate("/");
      return;
    }

    setError(translations.loginError);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: currentColors.lightGrayBg }}>
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md"
        style={{
          backgroundColor: currentColors.pureWhite,
          color: currentColors.darkText,
        }}>
        <h1
          className="text-3xl font-semibold mb-6 text-center"
          style={{ color: currentColors.darkText }}>
          {translations.title}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.mailLabel}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
          />
        </div>
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.passwordLabel}
          </label>
          <div
            className="flex items-center rounded-md border border-gray-300"
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full p-2 focus:outline-none focus:ring-0 bg-transparent"
              style={{ color: currentColors.darkText }}
            />
            <span
              className="p-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: currentColors.mediumGrayText }}>
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
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            style={{ borderColor: currentColors.mediumGrayText }}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm"
            style={{ color: currentColors.darkText }}>
            {translations.rememberMe}
          </label>
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 cursor-pointer"
          style={{
            backgroundColor: currentColors.logoPrimaryBlue,
            color: currentColors.whiteText,
          }}>
          {translations.loginButton}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
