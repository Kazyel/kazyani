"use client";

import { type FilteredCharacters } from "./guess-character";
import { type Characters } from "@/features/animes/api/use-get-characters";

import { useEffect, useRef, useState, useMemo } from "react";

import { ButtonRipple } from "@/components/button-ripple";
import Image from "next/image";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Loader2 } from "lucide-react";

interface CharacterProps {
    characterList: Characters[];
    isLoading: boolean;
}

export const Character = ({ characterList, isLoading }: CharacterProps) => {
    const [characterNames, setCharacterNames] = useState<string[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [filteredNames, setFilteredNames] = useState<FilteredCharacters[]>(
        []
    );
    const [charactersToGuess, setCharactersToGuess] = useState<
        FilteredCharacters[]
    >([]);

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
                  label: character.name.full,
                  imageLarge: character.image.large,
                  imageMedium: character.image.medium,
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

    const updateCharacterNames = (characterName: string, index: number) => {
        const newCharacterNames = [...characterNames];
        newCharacterNames[index] = characterName;
        setCharacterNames(newCharacterNames);
    };

    const handleGuessCharacter = () => {
        if (characterNames.length !== 4) {
            alert("Please enter all character names.");
        }
    };

    const sortedNames = filteredNames.sort((a, b) =>
        a.label.localeCompare(b.label)
    );

    const handleReShuffle = () => {
        setOpenIndex(null);
        setCharacterNames([]);

        const newCharacters = shuffleCharacters();
        setCharactersToGuess(newCharacters);
    };

    const handleInputChange = (value: string, index: number) => {
        setOpenIndex(index);
        updateCharacterNames(value, index);

        const filtered = filteredCharacters
            .filter((character) =>
                character.label.toLowerCase().includes(value.toLowerCase())
            )
            .sort((a, b) => a.label.localeCompare(b.label));

        setFilteredNames(filtered.slice(0, 15));
    };

    return (
        <>
            <div className="flex gap-x-12">
                {isLoading &&
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex flex-col gap-y-4">
                            <div className="rounded-lg bg-zinc-200 dark:bg-muted-foreground flex justify-center items-center w-[275px] h-[375px]">
                                <Loader2 className="animate-spin size-12 text-black dar:text-white" />
                            </div>
                            <div className="rounded-lg relative drop-shadow-sm">
                                <Command>
                                    <CommandInput placeholder="Enter character name..." />

                                    <CommandList
                                        ref={commandListRef}
                                        className="absolute top-10 w-full bg-white drop-shadow-sm rounded-sm z-50 max-h-[225px] transition-transform ease duration-300 translate-y-1"
                                    ></CommandList>
                                </Command>
                            </div>
                        </div>
                    ))}

                {charactersToGuess.map((character, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-y-4  w-[275px] h-[425px]"
                    >
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src={character.imageLarge}
                                alt="Character"
                                className="drop-shadow-md  w-[275px] h-[425px]"
                                width={275}
                                height={425}
                            />
                            <div className="w-full h-full absolute -bottom-16 from-[#fff]/65 dark:from-[#000]/65 hover:bottom-0 transition-all duration-300 ease to-transparent bg-gradient-to-t z-10"></div>
                        </div>

                        <div className="rounded-lg relative drop-shadow-sm">
                            <Command loop>
                                <CommandInput
                                    value={characterNames[index]}
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
                                        {sortedNames.map((character) => (
                                            <CommandItem
                                                key={character.id}
                                                value={character.label}
                                                onSelect={(currentValue) => {
                                                    updateCharacterNames(
                                                        currentValue,
                                                        index
                                                    );
                                                    setOpenIndex(null);
                                                }}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    updateCharacterNames(
                                                        character.label,
                                                        index
                                                    );
                                                    setOpenIndex(null);
                                                }}
                                            >
                                                {character.label}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                ) : (
                                    <CommandList></CommandList>
                                )}
                            </Command>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-x-6">
                <ButtonRipple className="cursor-pointer" onClick={() => {}}>
                    Guess
                </ButtonRipple>
                <ButtonRipple
                    className="cursor-pointer"
                    onClick={handleReShuffle}
                >
                    Re-shuffle
                </ButtonRipple>
                <ButtonRipple className="cursor-pointer">Foda-se?</ButtonRipple>
            </div>
        </>
    );
};
