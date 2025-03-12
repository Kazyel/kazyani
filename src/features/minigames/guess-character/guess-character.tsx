"use client";

import { useGuessCharacters } from "@/features/animes/api/use-get-characters";
import { Character } from "./character";

export type FilteredCharacters = {
    id: string;
    label: string;
    image: string;
};

function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const GuessCharacter = () => {
    const { data, isLoading } = useGuessCharacters("Howl's Moving Castle");

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!data) {
        return <p>No data found.</p>;
    }

    const charactersList = data!.Media!.characters!.nodes!.filter(
        (character) => character!.name!.full! !== "Narrator"
    );

    const filteredCharacters: FilteredCharacters[] = charactersList.map(
        (character) => ({
            id: character!.name!.full!,
            label: character!.name!.full!,
            image: character!.image!.large!,
        })
    );

    const charactersToGuess: FilteredCharacters[] = shuffle(
        [...filteredCharacters].slice(0, 4)
    );

    return (
        <>
            <div className="flex flex-col gap-y-4 justify-center items-center">
                <h1 className="text-6xl mb-8 font-bold">Guess the Character</h1>
                <Character
                    characters={filteredCharacters}
                    charactersToGuess={charactersToGuess}
                />
            </div>
        </>
    );
};
