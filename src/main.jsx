import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";
import { MotionProvider } from "./context/MotionContext.jsx";
import "./documentary.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
);
