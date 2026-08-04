import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

console.log("KUMARI CORE: Loading Bootstrap...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("KUMARI CORE: Critical Failure - Root element not found.");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log("KUMARI CORE: System Mounted.");
}
