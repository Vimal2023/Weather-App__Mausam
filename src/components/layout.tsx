import { type PropsWithChildren } from "react";
import { Header } from "./header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted min-h-screen">
      <Header />
      <main className="min-h-screen px-2 sm:px-4 py-8 max-w-full">
        {children}
      </main>
      <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
        <div className="px-2 sm:px-4 max-w-full text-center text-gray-400">
          <p>
            Made by ❤️ Code by{" "}
            <a
              href="https://portfolio-c-vimal-anand.vercel.app/"
              target="_blank"
              className="underline text-amber-800"
            >
              Vimal Anand
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;