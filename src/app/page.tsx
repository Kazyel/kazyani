"use client";

import { ButtonRipple } from "@/components/button-ripple";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import Kazyani from "@/assets/kazyani.png";

export default function Home() {
  const router = useRouter();
  const logoRef = useRef<HTMLImageElement>(null);

  const handleNavigation = (path: string) => {
    router.prefetch(path);
    router.push(path);
  };

  return (
    <section className="flex flex-col max-w-[600px] size-full items-center gap-y-6 relative">
      <div className="flex justify-center">
        <Image
          ref={logoRef}
          src={Kazyani}
          alt="Kazyani"
          width={1450}
          height={865}
          className="z-50 aspect-video w-3/4 logo-title"
        />
      </div>

      <div className="gap-y-5 flex flex-col w-full">
        <ButtonRipple
          className=" bg-indigo-400 rounded-md px-6 py-12 hover:bg-indigo-500 transition-all duration-200 flex flex-col items-start w-full cursor-pointerrelative overflow-hidden hover:-translate-y-1 hover:translate-x-1 before:content-[''] before:absolute before:inset-0 before:rounded-md before:border-b-4 before:border-l-4 before:border-indigo-50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 cursor-pointer"
          onClick={() => handleNavigation("/guess/character")}
        >
          <p className="text-2xl font-bold text-white">Character guessing</p>
          <p className="text-indigo-100">How many characters can you guess?</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all duration-200 flex flex-col items-start w-full cursor-pointerrelative overflow-hidden hover:-translate-y-1 hover:translate-x-1 before:content-[''] before:absolute before:inset-0 before:rounded-md before:border-b-4 before:border-l-4 before:border-indigo-50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 cursor-pointer"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-2xl font-bold text-white">???</p>
          <p className="text-indigo-100">Coming soon...</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all duration-200 flex flex-col items-start w-full cursor-pointerrelative overflow-hidden hover:-translate-y-1 hover:translate-x-1 before:content-[''] before:absolute before:inset-0 before:rounded-md before:border-b-4 before:border-l-4 before:border-indigo-50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 cursor-pointer"
          cursor-pointer
          disabled={true}
          onClick={() => handleNavigation("/")}
        >
          <p className="text-2xl font-bold text-white">???</p>
          <p className="text-indigo-100">Coming soon...</p>
        </ButtonRipple>

        <ButtonRipple
          className="bg-indigo-500 rounded-md px-6 py-12 hover:bg-indigo-600 transition-all duration-200 flex flex-col items-start w-full cursor-pointerrelative overflow-hidden hover:-translate-y-1 hover:translate-x-1 before:content-[''] before:absolute before:inset-0 before:rounded-md before:border-b-4 before:border-l-4 before:border-indigo-50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200 cursor-pointer"
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
