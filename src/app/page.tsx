"use client";

import { ButtonRipple } from "@/components/button-ripple";

import { useRouter } from "next/navigation";
import Image from "next/image";

import * as React from "react";

import Kazyani from "@/assets/kazyani.png";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.prefetch(path);
    router.push(path);
  };

  return (
    <section className="flex flex-col max-w-[600px] size-full items-center gap-y-6 relative">
      <div className="flex justify-center">
        <Image
          src={Kazyani}
          alt="Kazyani"
          width={1450}
          height={865}
          className="z-50 aspect-video w-3/4"
        />
      </div>

      <div className="gap-y-5 flex flex-col w-full">
        <ButtonRipple
          className="bg-indigo-400 rounded-md px-6 py-12 hover:bg-indigo-500 transition-all flex flex-col items-start w-full cursor-pointer"
          onClick={() => handleNavigation("/guess/character")}
        >
          <p className="text-2xl font-bold text-white">Character guessing</p>
          <p className="text-indigo-100">How many characters you can guess?</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all flex flex-col items-start w-full cursor-pointer disabled:opacity-100 disabled:bg-indigo-disabled"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-2xl font-bold text-white">???</p>
          <p className="text-indigo-100">Coming soon...</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all flex flex-col items-start w-full cursor-pointer disabled:opacity-100 disabled:bg-indigo-disabled"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-2xl font-bold text-white">???</p>
          <p className="text-indigo-100">Coming soon...</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all flex flex-col items-start w-full cursor-pointer disabled:opacity-100 disabled:bg-indigo-disabled"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-2xl font-bold text-white">???</p>
          <p className="text-indigo-100">Coming soon...</p>
        </ButtonRipple>
      </div>
    </section>
  );
}
