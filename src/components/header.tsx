import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "@/context/theme-provider";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className="flex h-12 sm:h-16 items-center  justify-around  sm:justify-between px-2 sm:px-4 max-w-full">
        <Link to={"/"}>
          <img
            src={theme === "dark" ? "/logom.png" : "/logom.png"}
            alt="Mausam logo"
            className="h-10 sm:h-14"
          />
        </Link>

        <div className="flex gap-2 sm:gap-4">
          <CitySearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
