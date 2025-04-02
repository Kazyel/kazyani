"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  return (
    <div className="grid grid-rows-[75px_1fr_94px] grid-cols-1 border-r border-indigo-border row-span-full">
      <div className="p-4 flex items-center justify-between">
        {!isMainPage ? (
          <Link href="/" className="text-2xl font-semibold text-indigo-100">
            Kazyani
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {!isMainPage ? (
        <div className="flex flex-col items-center justify-center border-t border-b h-full border-indigo-border">
          <Link
            prefetch
            href="/guess/character"
            className="text-xl font-extralight hover:bg-indigo-500/30 w-full p-3 flex items-center justify-center"
          >
            Character Guess
          </Link>

          {/* TODO: ADD LINKS LATER */}
          <Link
            prefetch
            href="/guess/character"
            className="text-xl font-extralight hover:bg-indigo-500/30 w-full p-3 flex items-center justify-center"
          >
            ???
          </Link>
          <Link
            prefetch
            href="/guess/character"
            className="text-xl font-extralight hover:bg-indigo-500/30 w-full p-3 flex items-center justify-center"
          >
            ???
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-t border-b h-full border-indigo-border"></div>
      )}

      <div className="p-4 flex items-center"></div>
    </div>
  );
};
