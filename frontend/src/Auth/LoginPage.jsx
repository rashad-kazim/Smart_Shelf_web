// src/pages/Auth/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roles";
import { mockUsers } from "../data/mockUsers";
import { mockCompanyUsers } from "../data/mockCompanyUsers";

const LoginPage = () => {
  // FIX: All necessary data and functions are taken directly from context
  const { login, appTranslations, language, currentColors: colors } = useAuth();

  const navigate = useNavigate();
  const translations =
    appTranslations[language]?.login || appTranslations.en.login;

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

  useEffect(() => {
    if (rememberMe) localStorage.setItem("rememberMe", "true");
    else localStorage.removeItem("rememberMe");
  }, [rememberMe]);

  const handleLogin = () => {
    setError("");
    if (email === "kresad555@gmail.com" && password === "Admin448.") {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      login({ email, role: ROLES.ADMIN, name: "Kresad", surname: "Kazimov" });
      navigate("/");
      return;
    }
    const supermarketUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (supermarketUser) {
      setError(translations.mobileOnlyAccess);
      return;
    }
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
      login(companyUser);
      navigate("/");
      return;
    }
    setError(translations.loginError);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: colors.lightGrayBg }}>
      <div
        className="p-8 rounded-lg shadow-md w-full max-w-md"
        style={{ backgroundColor: colors.pureWhite }}>
        <h1
          className="text-3xl font-semibold mb-6 text-center"
          style={{ color: colors.darkText }}>
          {translations.title || "Login"}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
            className="w-full p-2 rounded-md border"
            style={{
              backgroundColor: colors.pureWhite,
              color: colors.darkText,
              borderColor: colors.mediumGrayText,
            }}
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
            className="flex items-center border rounded-md"
            style={{ borderColor: colors.mediumGrayText }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full p-2 bg-transparent focus:outline-none"
              style={{ color: colors.darkText }}
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
            className="mr-2 h-4 w-4 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm"
            style={{ color: colors.darkText }}>
            {translations.rememberMe}
          </label>
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 rounded-md font-medium text-white transition-colors"
          style={{ backgroundColor: colors.logoPrimaryBlue }}>
          {translations.loginButton}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
