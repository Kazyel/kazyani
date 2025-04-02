"use client";

import { ButtonRipple } from "@/components/button-ripple";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.prefetch(path);
    router.push(path);
  };

  return (
    <section className="flex flex-col gap-y-12 max-w-[625px]">
      <div className="gap-y-4 w-full flex flex-col">
        <h1 className="text-5xl font-bold">Kazyani</h1>
        <div className="">
          <p className="text-indigo-200 text-lg pl-2">
            Welcome to Kazyani, a silly little website where you can have fun putting your knowledge
            about animes to test!
          </p>
        </div>
      </div>

      <div className="gap-y-4 flex flex-col w-full">
        <ButtonRipple
          className="bg-indigo-400 rounded-md px-6 py-12 hover:bg-indigo-500 transition-all flex flex-col items-start w-full cursor-pointer"
          onClick={() => handleNavigation("/guess/character")}
        >
          <p className="text-xl font-bold text-white">Character guessing</p>
          <p className="text-sm text-indigo-200/85">How many characters you can guess?</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all flex flex-col items-start w-full cursor-pointer disabled:opacity-100 disabled:bg-indigo-disabled"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-xl font-bold text-white">???</p>
          <p className="text-sm text-indigo-200/85">Coming soon...</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all flex flex-col items-start w-full cursor-pointer disabled:opacity-100 disabled:bg-indigo-disabled"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-xl font-bold text-white">???</p>
          <p className="text-sm text-indigo-200/85">Coming soon...</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all flex flex-col items-start w-full cursor-pointer disabled:opacity-100 disabled:bg-indigo-disabled"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-xl font-bold text-white">???</p>
          <p className="text-sm text-indigo-200/85">Coming soon...</p>
        </ButtonRipple>
      </div>
    </section>
  );
}
