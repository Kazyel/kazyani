import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

import Kazyani from "@/assets/kazyani.png";
import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-around w-1/2 relative">
      <Link
        href="/"
        className="text-2xl font-semibold brightness-[0.85] hover:brightness-100 duration-200 transition-all"
      >
        <Image
          src={Kazyani}
          alt="Kazyani"
          width={1450}
          height={865}
          className="z-50 aspect-video w-16"
        />
      </Link>

      <div className="p-4 flex items-center">
        <Link
          href="https://github.com/kazyel"
          target="_blank"
          rel="noreferrer"
          className="flex gap-x-2 items-center text-indigo-200 hover:text-indigo-400 transition-all duration-200"
        >
          <SiGithub className="size-5" />
          GitHub
        </Link>
      </div>
    </div>
  );
};
