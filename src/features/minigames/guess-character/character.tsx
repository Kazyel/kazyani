"use client";

import { type FilteredCharacters } from "./guess-character";
import { useEffect, useRef, useState, Suspense } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface CharacterProps {
    characters: FilteredCharacters[];
    charactersToGuess: FilteredCharacters[];
    isLoading: boolean;
}

export const Character = ({
    characters,
    charactersToGuess,
    isLoading,
}: CharacterProps) => {
    const [characterNames, setCharacterNames] = useState<string[]>([]);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
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

    const updateCharacterNames = (characterName: string, index: number) => {
        const newCharacterNames = [...characterNames];
        newCharacterNames[index] = characterName;
        setCharacterNames(newCharacterNames);
    };

    const handleGuessCharacter = () => {
        if (characterNames.length !== 4) {
            alert("Please enter all character names.");
        }

        if (charactersToGuess) {
            if (true) {
                alert("Correct!");
            }
        }
    };

    return (
        <>
            <div className="flex gap-x-12">
                {charactersToGuess.map((_, index) => (
                    <div key={index} className="flex flex-col gap-y-4">
                        <Image
                            src={charactersToGuess[index]!.image!}
                            alt="Character"
                            className="rounded-lg w-full h-[400px]"
                            width={1920}
                            height={1080}
                        />

                        <div className="rounded-lg relative drop-shadow-sm">
                            <Command>
                                <CommandInput
                                    value={characterNames[index]}
                                    onValueChange={(value) => {
                                        setOpenIndex(index);
                                        updateCharacterNames(value, index);
                                    }}
                                    onFocus={() => setOpenIndex(index)}
                                    placeholder="Enter character name..."
                                />

                                {openIndex === index ? (
                                    <CommandList
                                        ref={commandListRef}
                                        className="absolute top-10 w-full bg-white drop-shadow-sm rounded-sm z-50 max-h-[225px] transition-transform ease duration-300 translate-y-1"
                                    >
                                        {characters.map((character) => (
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

            <Button className="cursor-pointer" onClick={handleGuessCharacter}>
                Guess
            </Button>
        </>
    );
};
