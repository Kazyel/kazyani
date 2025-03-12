"use client";

import { useGuessCharacters } from "@/features/animes/api/use-get-characters";
import { Character } from "./character";

export type FilteredCharacters = {
    id: number;
    label: string;
    image: string;
};

export const GuessCharacter = () => {
    const { characterList, isLoading } = useGuessCharacters(4);

    return (
        <>
            <div className="flex flex-col gap-y-4 justify-center items-center">
                <h1 className="text-6xl mb-8 font-bold text-primary">
                    Guess the Character
                </h1>
                <Character
                    characterList={characterList ?? []}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};
