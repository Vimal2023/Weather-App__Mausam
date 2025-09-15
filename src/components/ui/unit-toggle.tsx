import { useTemperature } from "@/context/temperature-provider";

export function UnitToggle() {
  const { unit, toggleUnit } = useTemperature();

  return (
    <div
      onClick={toggleUnit}
      className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg border hover:bg-muted transition"
    >
      <span className="font-medium">
        {unit === "metric" ? "°C" : "°F"}
      </span>
    </div>
  );
}
