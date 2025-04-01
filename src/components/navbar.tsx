"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { setTheme } = useTheme();

  const pathname = usePathname();
  const isMainPage = pathname === "/";

  return (
    <div className="grid grid-rows-[75px_1fr_94px] grid-cols-1 border-r border-indigo-500/30 row-span-full">
      <div className="p-4 flex items-center justify-between">
        {!isMainPage ? (
          <Link href="/" className="text-2xl font-semibold text-indigo-100">
            Kazyani
          </Link>
        ) : (
          <div></div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="border-indigo-500/50 hover:bg-indigo-500/10 focus-visible:ring-0 "
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 stroke-indigo-300" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 stroke-indigo-300" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" className="border-indigo-500/30">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!isMainPage ? (
        <div className="flex flex-col items-center justify-center border-t border-b h-full border-indigo-500/30">
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
        <div className="flex flex-col items-center justify-center border-t border-b h-full border-indigo-500/30"></div>
      )}

      <div className="p-4 flex items-center"></div>
    </div>
  );
};
