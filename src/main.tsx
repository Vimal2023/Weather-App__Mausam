import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TemperatureProvider } from "./context/temperature-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TemperatureProvider>
      <App />
    </TemperatureProvider>
  </StrictMode>
);
