"use client";

import { useGuessCharacters } from "@/features/animes/api/use-get-characters";
import { Character } from "./character";
import { shuffle } from "lodash";

export type FilteredCharacters = {
    id: number;
    label: string;
    image: string;
};

export const GuessCharacter = () => {
    const {
        characterList,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        isInitialLoading,
    } = useGuessCharacters(2);

    console.log(isLoading, "isLoading");
    console.log(isFetching, "isFetching");
    console.log(isSuccess, "isSuccess");
    console.log(isError, "isError");
    console.log(isInitialLoading, "isInitialLoading");

    const filteredCharacters: FilteredCharacters[] = characterList
        ? characterList!.map((character, index) => ({
              id: index,
              label: character.name.full,
              image: character.image.large,
          }))
        : [];

    const randomStartIndex = Math.floor(
        Math.random() * filteredCharacters.length
    );

    const charactersToGuess: FilteredCharacters[] = shuffle(
        [...filteredCharacters].slice(randomStartIndex, randomStartIndex + 4)
    );

    return (
        <>
            <div className="flex flex-col gap-y-4 justify-center items-center">
                <h1 className="text-6xl mb-8 font-bold">Guess the Character</h1>
                <Character
                    characters={filteredCharacters}
                    charactersToGuess={charactersToGuess}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};
