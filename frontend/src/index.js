import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // index.css dosyasını buraya ekliyoruz

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
