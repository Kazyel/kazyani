"use client";

import { Characters, useGetCharacters } from "@/features/guess-character/api/use-get-characters";
import { ButtonRipple } from "@/components/button-ripple";
import { useEffect, useMemo, useRef, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

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

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [pointsAccumulated, setPointsAccumulated] = useState<number>(0);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [filteredNames, setFilteredNames] = useState<Characters[]>([]);

  const [charactersToGuess, setCharactersToGuess] = useState<Characters[]>([]);

  const [guessedCharacters, setGuessedCharacters] = useState<GuessedCharacters[]>([
    { fullName: "", guessed: false },
    { fullName: "", guessed: false },
    { fullName: "", guessed: false },
    { fullName: "", guessed: false },
  ]);

  const commandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandListRef.current && !commandListRef.current.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const shuffleCharacters = () => {
    const shuffledCharacters: Characters[] = [];
    const usedIndices = new Set<number>();

    while (shuffledCharacters.length < 4) {
      const randomIndex = Math.floor(Math.random() * characterList?.length!);

      if (!usedIndices.has(randomIndex) && characterList) {
        usedIndices.add(randomIndex);
        shuffledCharacters.push(characterList[randomIndex]);
      }
    }

    return shuffledCharacters;
  };

  useEffect(() => {
    if (characterList?.length! > 0) {
      const shuffledCharacters = shuffleCharacters();
      setCharactersToGuess(shuffledCharacters);
    }
  }, [characterList]);

  const sortedNames = filteredNames.sort((a, b) => a.name.full.localeCompare(b.name.full));

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

    const filtered = characterList
      ?.filter((character) => character.name.full.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.name.full.localeCompare(b.name.full));

    setFilteredNames(filtered!.slice(0, 15));
  };

  const handleGuessCharacter = () => {
    if (guessedCharacters.length !== 4) {
      toast.info("Please enter all character names.");
    }

    for (const [index, character] of charactersToGuess.entries()) {
      const guessResults = [...guessedCharacters];

      if (guessResults[index].fullName === character.name.full) {
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
              <CharacterPortrait key={index} isLoading={isLoading} />
            ))}

          {charactersToGuess.map((character, index) => (
            <div key={index} className="flex flex-col gap-y-4">
              <CharacterPortrait characterImage={character.image.large} />
              {!isGameFinished ? (
                <div className="rounded-lg relative drop-shadow-sm z-50">
                  <Command loop>
                    <CommandInput
                      value={guessedCharacters[index].fullName}
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
                            key={character.name.full}
                            value={character.name.full}
                            onSelect={(currentValue) => {
                              updateCharacterNames(currentValue, index);
                              setOpenIndex(null);
                            }}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              updateCharacterNames(character.name.full, index);
                              setOpenIndex(null);
                            }}
                          >
                            {character.name.full}
                          </CommandItem>
                        ))}
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
                        guessedCharacters[index].guessed ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {character.name.full}
                    </div>
                  }
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-x-6 mt-5">
          <ButtonRipple className="cursor-pointer" onClick={handleGuessCharacter}>
            Guess
          </ButtonRipple>
          <ButtonRipple className="cursor-pointer" onClick={handleReShuffle}>
            Re-shuffle
          </ButtonRipple>
        </div>
      </div>
    </>
  );
};
