import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface CharacterPortraitProps {
    characterImage?: string;
    isLoading?: boolean;
}

export const CharacterPortrait = ({
    characterImage,
    isLoading,
}: CharacterPortraitProps) => {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-y-4">
                <div className="rounded-lg bg-zinc-200 dark:bg-muted-foreground flex justify-center items-center w-[275px] h-[425px]">
                    <Loader2 className="animate-spin size-12 text-black dar:text-white" />
                </div>
                <div className="rounded-lg relative drop-shadow-sm">
                    <Command>
                        <CommandInput placeholder="Enter character name..." />

                        <CommandList className="absolute top-10 w-full bg-white drop-shadow-sm rounded-sm z-50 max-h-[225px] transition-transform ease duration-300 translate-y-1"></CommandList>
                    </Command>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-lg">
            <Image
                src={characterImage!}
                alt="Character"
                className="drop-shadow-md  w-[275px] h-[425px]"
                width={275}
                height={425}
            />
            <div className="w-full h-full absolute -bottom-16 from-[#fff]/65 dark:from-[#000]/65 hover:bottom-0 transition-all duration-300 ease to-transparent bg-gradient-to-t z-10"></div>
        </div>
    );
};
