import Link from "next/link";
import { SiX } from "@icons-pack/react-simple-icons";
import { BadgeInfo } from "lucide-react";

const DARK_COLOR = "#312c8511";
const STATIC_COLOR = "#232254";

export const Footer = () => {
  const backgroundImage = `radial-gradient(135% 135% at 50% 100%, ${DARK_COLOR} 50%, ${STATIC_COLOR})`;

  return (
    <footer
      style={{ backgroundImage }}
      className="flex flex-col items-center justify-center gap-y-4 p-4 col-span-full border-t border-indigo-border bg-indigo-900/15"
    >
      <div className="flex gap-x-4 text-[0.9rem]">
        <Link
          href="/about"
          className="flex gap-x-1.5 text-indigo-footer items-center hover:text-indigo-400 transition-all duration-200"
        >
          <BadgeInfo className="size-5" />
          About
        </Link>
        <span className="text-indigo-400">•</span>
        <Link
          href="https://twitter.com/kazyel"
          target="_blank"
          rel="noreferrer"
          className="flex gap-x-1.5 text-indigo-footer items-center hover:text-indigo-400 transition-all duration-200"
        >
          <SiX className="size-4" />
          Twitter
        </Link>
      </div>

      <span className="text-xs text-indigo-footer/65">© {new Date().getFullYear()} Kazyani</span>
    </footer>
  );
};
