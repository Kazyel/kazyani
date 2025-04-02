import Link from "next/link";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-y-4 p-4 col-start-2 border-t border-indigo-border">
      <div className="flex gap-x-8 text-[0.9rem]">
        <Link
          href="https://github.com/kazyel"
          target="_blank"
          rel="noreferrer"
          className="flex gap-x-2 items-center text-indigo-footer hover:text-indigo-400 transition-all duration-200"
        >
          <SiGithub className="size-5" />
          GitHub
        </Link>

        <Link
          href="https://twitter.com/kazyel"
          target="_blank"
          rel="noreferrer"
          className="flex gap-x-2 text-indigo-footer items-center hover:text-indigo-400 transition-all duration-200"
        >
          <SiX className="size-5" />
          Twitter
        </Link>
      </div>

      <span className="text-xs text-indigo-footer/65">© {new Date().getFullYear()} Kazyani</span>
    </footer>
  );
};
