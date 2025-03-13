"use client";

import { useGetCharacters } from "@/features/guess-character/api/use-get-characters";
import { ButtonRipple } from "@/components/button-ripple";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { CharacterPortrait } from "./character-portrait";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type FilteredCharacters = {
    id: number;
    fullName: string;
    largeImage: string;
};

export type GuessedCharacters = {
    fullName: string;
    guessed: boolean;
};

export const GuessCharacter = () => {
    const { characterList, isLoading } = useGetCharacters(10);

    const [pointsAccumulated, setPointsAccumulated] = useState<number>(0);
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [filteredNames, setFilteredNames] = useState<FilteredCharacters[]>(
        []
    );

    const [charactersToGuess, setCharactersToGuess] = useState<
        FilteredCharacters[]
    >([]);

    const [guessedCharacters, setGuessedCharacters] = useState<
        GuessedCharacters[]
    >([
        { fullName: "", guessed: false },
        { fullName: "", guessed: false },
        { fullName: "", guessed: false },
        { fullName: "", guessed: false },
    ]);

    const commandListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                commandListRef.current &&
                !commandListRef.current.contains(event.target as Node)
            ) {
                setOpenIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredCharacters: FilteredCharacters[] = useMemo(() => {
        return characterList
            ? characterList.map((character, index) => ({
                  id: index,
                  fullName: character.name.full,
                  largeImage: character.image.large,
              }))
            : [];
    }, [characterList]);

    const shuffleCharacters = () => {
        const shuffledCharacters: FilteredCharacters[] = [];
        const usedIndices = new Set<number>();

        while (shuffledCharacters.length < 4) {
            const randomIndex = Math.floor(
                Math.random() * filteredCharacters.length
            );

            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                shuffledCharacters.push(filteredCharacters[randomIndex]);
            }
        }

        return shuffledCharacters;
    };

    useEffect(() => {
        if (filteredCharacters.length > 0) {
            const shuffledCharacters = shuffleCharacters();
            setCharactersToGuess(shuffledCharacters);
        }
    }, [filteredCharacters]);

    const sortedNames = filteredNames.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
    );

    const handleReShuffle = () => {
        setOpenIndex(null);
        setGuessedCharacters([
            { fullName: "", guessed: false },
            { fullName: "", guessed: false },
            { fullName: "", guessed: false },
            { fullName: "", guessed: false },
        ]);

        const newCharacters = shuffleCharacters();
        setCharactersToGuess(newCharacters);
        setIsGameFinished(false);
    };

    const updateCharacterNames = (characterName: string, index: number) => {
        const newCharacterNames = [...guessedCharacters];
        newCharacterNames[index].fullName = characterName;
        setGuessedCharacters(newCharacterNames);
    };

    const handleInputChange = (value: string, index: number) => {
        setOpenIndex(index);
        updateCharacterNames(value, index);

        const filtered = filteredCharacters
            .filter((character) =>
                character.fullName.toLowerCase().includes(value.toLowerCase())
            )
            .sort((a, b) => a.fullName.localeCompare(b.fullName));

        setFilteredNames(filtered.slice(0, 15));
    };

    const handleGuessCharacter = () => {
        if (guessedCharacters.length !== 4) {
            toast.info("Please enter all character names.");
        }

        for (const [index, character] of charactersToGuess.entries()) {
            const guessResults = [...guessedCharacters];

            if (guessResults[index].fullName === character.fullName) {
                guessResults[index].guessed = true;
            }

            setGuessedCharacters(guessResults);
        }

        const allCorrect = guessedCharacters.every((character, index) => {
            return character.guessed;
        });

        if (!allCorrect) {
            setIsGameFinished(true);
            setPointsAccumulated(0);
            toast.error("You lost the game! Restarting your points...");
        }

        if (allCorrect) {
            setIsGameFinished(true);
            setPointsAccumulated(pointsAccumulated + 1);
            toast.success("You won the game!");
        }
    };

    return (
        <>
            <div className="flex flex-col gap-y-4 justify-center items-center">
                <h1 className="text-6xl mb-8 font-bold text-primary">
                    Guess the Character - {pointsAccumulated} points
                </h1>

                <div className="flex gap-x-12">
                    {isLoading &&
                        Array.from({ length: 4 }).map((_, index) => (
                            <CharacterPortrait
                                key={index}
                                isLoading={isLoading}
                            />
                        ))}

                    {charactersToGuess.map((character, index) => (
                        <div key={index} className="flex flex-col gap-y-4">
                            <CharacterPortrait
                                characterImage={character.largeImage}
                            />
                            {!isGameFinished ? (
                                <div className="rounded-lg relative drop-shadow-sm z-50">
                                    <Command loop>
                                        <CommandInput
                                            value={
                                                guessedCharacters[index]
                                                    .fullName
                                            }
                                            onValueChange={(value) => {
                                                handleInputChange(value, index);
                                            }}
                                            placeholder="Enter character name..."
                                            onKeyDown={(event) => {
                                                if (event.key === "Escape") {
                                                    setOpenIndex(null);
                                                }
                                            }}
                                        />

                                        {openIndex === index ? (
                                            <CommandList
                                                ref={commandListRef}
                                                className="absolute top-10 w-full bg-background drop-shadow-sm rounded-sm z-50 max-h-[225px] transition-transform ease duration-300 translate-y-1"
                                            >
                                                {sortedNames.map(
                                                    (character) => (
                                                        <CommandItem
                                                            key={character.id}
                                                            value={
                                                                character.fullName
                                                            }
                                                            onSelect={(
                                                                currentValue
                                                            ) => {
                                                                updateCharacterNames(
                                                                    currentValue,
                                                                    index
                                                                );
                                                                setOpenIndex(
                                                                    null
                                                                );
                                                            }}
                                                            onMouseDown={(
                                                                event
                                                            ) => {
                                                                event.preventDefault();
                                                                updateCharacterNames(
                                                                    character.fullName,
                                                                    index
                                                                );
                                                                setOpenIndex(
                                                                    null
                                                                );
                                                            }}
                                                        >
                                                            {character.fullName}
                                                        </CommandItem>
                                                    )
                                                )}
                                            </CommandList>
                                        ) : (
                                            <CommandList></CommandList>
                                        )}
                                    </Command>
                                </div>
                            ) : (
                                <>
                                    {
                                        <div
                                            className={cn(
                                                "text-center font-semibold",
                                                guessedCharacters[index].guessed
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            )}
                                        >
                                            {character.fullName}
                                        </div>
                                    }
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-x-6 mt-5">
                    <ButtonRipple
                        className="cursor-pointer"
                        onClick={handleGuessCharacter}
                    >
                        Guess
                    </ButtonRipple>
                    <ButtonRipple
                        className="cursor-pointer"
                        onClick={handleReShuffle}
                    >
                        Re-shuffle
                    </ButtonRipple>
                </div>
            </div>
        </>
    );
};
