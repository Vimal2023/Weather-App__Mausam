import  { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Unit = "metric" | "imperial"; // metric = °C, imperial = °F

interface TemperatureContextType {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  toggleUnit: () => void;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export function TemperatureProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>("metric");

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <TemperatureContext.Provider value={{ unit, setUnit, toggleUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
}

export function useTemperature() {
  const context = useContext(TemperatureContext);
  if (!context) throw new Error("useTemperature must be used within TemperatureProvider");
  return context;
}
