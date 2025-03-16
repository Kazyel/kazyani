"use client";

import { Character, useGetCharacters } from "@/features/guess-character/api/use-get-characters";
import { ButtonRipple } from "@/components/button-ripple";
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { CharacterPortrait } from "./character-portrait";
import { toast } from "sonner";

type GuessEntry = {
  title: {
    romaji: string;
    english: string;
  };
  name: string;
  image: string;
};

export type AnimeTitle = {
  romaji: string;
  english: string;
};

export type GuessedEntries = {
  name: string;
  guessed: boolean;
};

export const GuessCharacter = () => {
  const { data, isLoading } = useGetCharacters(5);

  const [characterInput, setCharacterInput] = useState<string[]>([]);
  const [animeInput, setAnimeInput] = useState<string[]>([]);

  const [openCharacterSearch, setOpenCharacterSearch] = useState<number | null>(null);
  const [openAnimeSearch, setOpenAnimeSearch] = useState<number | null>(null);

  const [animesToSearch, setAnimesToSearch] = useState<string[]>([]);
  const [charactersToSearch, setCharactersToSearch] = useState<string[]>([]);

  const [filteredAnimes, setFilteredAnimes] = useState<string[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<string[]>([]);

  const [charactersToGuess, setCharactersToGuess] = useState<GuessEntry[]>([]);
  const [pointsAccumulated, setPointsAccumulated] = useState<number>(0);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  const [guessedAnimes, setGuessedAnimes] = useState<GuessedEntries[]>(
    Array.from({ length: 4 }).map(() => ({
      id: 0,
      name: "",
      guessed: false,
    }))
  );

  const [guessedCharacters, setGuessedCharacters] = useState<GuessedEntries[]>(
    Array.from({ length: 4 }).map(() => ({
      id: 0,
      name: "",
      guessed: false,
    }))
  );

  const commandCharacterRef = useRef<HTMLDivElement>(null);
  const commandAnimeRef = useRef<HTMLDivElement>(null);

  const populateCharacters = () => {
    const shuffledCharacters: GuessEntry[] = [];
    const usedIndices = new Set<number>();

    const allCharacters = data?.map((anime) => anime.characters.nodes);

    while (shuffledCharacters.length < 4) {
      const randomAnimeIndex = Math.floor(Math.random() * data?.length!);

      const randomCharacterIndex = Math.floor(
        Math.random() * allCharacters![randomAnimeIndex].length!
      );

      if (!usedIndices.has(randomCharacterIndex) && data) {
        usedIndices.add(randomCharacterIndex);

        shuffledCharacters.push({
          title: data[randomAnimeIndex].title,
          name: data[randomAnimeIndex].characters.nodes[randomCharacterIndex].name.full,
          image: data[randomAnimeIndex].characters.nodes[randomCharacterIndex].image.large,
        });
      }
    }

    return shuffledCharacters;
  };

  const populateAnimesToSearch = () => {
    const animeSet = new Set<string>();

    const toTitleCase = (name: string) => {
      return name.replace(/\w\S*/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    };

    const normalizeAnimeName = (name: string) => {
      return name
        .replace(/-/g, " ")
        .replace(/\s*\([^)]*\)$/, "")
        .replace(/\s*:?\s*Part\s*[1-9]\b.*$/i, "")
        .replace(/(\d+)([A-Za-z]+)/g, "$1 $2")
        .trim();
    };

    data?.forEach((character) => {
      const englishName = character.title.english;
      const romajiName = character.title.romaji;

      if (englishName) {
        animeSet.add(englishName);
      }

      if (romajiName) {
        animeSet.add(romajiName);
      }
    });

    const sortedAnimeNames = Array.from(animeSet).sort((a, b) => {
      const aHasNumbers = /\d*\s*\([^)]*\)$/.test(a);
      const bHasNumbers = /\d*\s*\([^)]*\)$/.test(b);

      if (aHasNumbers && !bHasNumbers) return 1;
      if (!aHasNumbers && bHasNumbers) return -1;

      return a.localeCompare(b);
    });

    setAnimesToSearch(sortedAnimeNames);
  };

  const populateCharactersToSearch = () => {
    const characterSet = new Set<string>();

    const allAnimes = data?.map((anime) => anime.characters.nodes);

    allAnimes?.forEach((anime) => {
      anime
        ?.sort((a, b) => a.name.full.localeCompare(b.name.full))
        .forEach((character) => {
          characterSet.add(character.name.full);
        });
    });

    setCharactersToSearch(Array.from(characterSet));
  };

  useEffect(() => {
    if (data) {
      const shuffledCharacters = populateCharacters();

      setCharactersToGuess(shuffledCharacters);
      populateAnimesToSearch();
      populateCharactersToSearch();
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandCharacterRef.current &&
        !commandCharacterRef.current.contains(event.target as Node)
      ) {
        setOpenCharacterSearch(null);
      }

      if (commandAnimeRef.current && !commandAnimeRef.current.contains(event.target as Node)) {
        setOpenAnimeSearch(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterItems = (items: string[], value: string, limit: number) => {
    if (!value) return items.slice(0, limit);

    const lowerValue = value.toLowerCase();
    const startsWithMatch = items.filter((item) => item.toLowerCase().startsWith(lowerValue));

    if (startsWithMatch.length === 0) {
      return items.filter((item) => item.toLowerCase().includes(lowerValue));
    }

    return startsWithMatch.slice(0, limit);
  };

  const handleAnimeInput = (value: string, index: number) => {
    setOpenAnimeSearch(index);

    const newInput = [...animeInput];
    newInput[index] = value;
    setAnimeInput(newInput);

    const filteredAnimes = () => filterItems(animesToSearch, value, 10);
    setFilteredAnimes(filteredAnimes().slice(0, 10));
  };

  const handleCharacterInput = (value: string, index: number) => {
    setOpenCharacterSearch(index);

    const newInput = [...characterInput];
    newInput[index] = value;
    setCharacterInput(newInput);

    const filteredCharacters = () => filterItems(charactersToSearch, value, 10);
    setFilteredCharacters(filteredCharacters().slice(0, 10));
  };

  const handleGuess = (
    name: string,
    index: number,
    guessedState: any[],
    setGuessedState: Dispatch<SetStateAction<any[]>>,
    inputState: string[],
    setInputState: Dispatch<SetStateAction<string[]>>
  ) => {
    const newInputState = [...inputState];
    newInputState[index] = name;

    setInputState(newInputState);

    const newGuessedState = [...guessedState];
    newGuessedState[index].name = name;
    setGuessedState(newGuessedState);
  };

  const handleGuessCharacter = (characterName: string, index: number) => {
    handleGuess(
      characterName,
      index,
      guessedCharacters,
      setGuessedCharacters,
      characterInput,
      setCharacterInput
    );
  };

  const handleGuessAnime = (animeName: string, index: number) => {
    handleGuess(animeName, index, guessedAnimes, setGuessedAnimes, animeInput, setAnimeInput);
  };

  const handleRestartGame = () => {
    const newCharacters = populateCharacters();

    setOpenCharacterSearch(null);
    setOpenAnimeSearch(null);
    setAnimeInput([]);
    setCharacterInput([]);

    setCharactersToGuess(newCharacters);

    setGuessedCharacters(
      Array.from({ length: 4 }).map(() => ({
        id: 0,
        name: "",
        guessed: false,
      }))
    );

    setGuessedAnimes(
      Array.from({ length: 4 }).map(() => ({
        id: 0,
        name: "",
        guessed: false,
      }))
    );

    setIsGameFinished(false);
  };

  const submitGuess = () => {
    if (guessedCharacters.length !== 4) {
      toast.info("Please enter all character names.");
    }

    for (const [index, character] of charactersToGuess.entries()) {
      const guessResults = [...guessedCharacters];

      if (guessResults[index].name === character.name) {
        guessResults[index].guessed = true;
      }
      setGuessedCharacters(guessResults);
    }

    for (const [index, character] of charactersToGuess.entries()) {
      const guessResults = [...guessedAnimes];
      if (
        guessedAnimes[index].name === character.title.english ||
        guessedAnimes[index].name === character.title.romaji
      ) {
        guessResults[index].guessed = true;
      }
      setGuessedAnimes(guessResults);
    }

    const allCorrect =
      guessedCharacters.every((character) => {
        return character.guessed;
      }) &&
      guessedAnimes.every((anime) => {
        return anime.guessed;
      });

    if (!allCorrect) {
      setIsGameFinished(true);
      toast.error("You lost the game! Restarting your points...");
      setPointsAccumulated(0);
    }
    if (allCorrect) {
      setIsGameFinished(true);
      toast.success("You won the game!");
      setPointsAccumulated(pointsAccumulated + 1);
    }
  };

  return (
    <div className="flex flex-col gap-y-12 justify-center items-center">
      <h1 className="text-5xl font-bold text-primary">
        Guess the Character - {pointsAccumulated} points
      </h1>

      <div className="flex flex-col justify-items-center items-center">
        <div className="flex gap-x-12 z-10">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <CharacterPortrait key={index} isLoading={isLoading} />
            ))}

          {charactersToGuess.map((character, index) => (
            <div
              key={character.name}
              className="flex flex-col gap-y-4 justify-center max-w-[275px]"
            >
              <CharacterPortrait characterImage={character.image} />

              <div className="h-[125px] flex flex-col gap-y-4 justify-center items-center">
                {!isGameFinished ? (
                  <>
                    <div className="rounded-lg drop-shadow-sm w-full z-[1] relative">
                      {/* Character Input */}
                      <Command loop>
                        <CommandInput
                          className="relative z-10"
                          value={characterInput[index]}
                          onValueChange={(value) => {
                            handleCharacterInput(value, index);
                          }}
                          placeholder="Enter character name..."
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              setOpenCharacterSearch(null);
                            }
                          }}
                        />

                        {openCharacterSearch === index && characterInput[index] ? (
                          <CommandList
                            ref={commandCharacterRef}
                            className="top-10 w-full bg-background drop-shadow-sm rounded-sm max-h-[225px] transition-transform ease duration-300 translate-y-1 absolute z-50"
                          >
                            {filteredCharacters.map((characterName, innerIndex) => (
                              <CommandItem
                                key={innerIndex}
                                value={characterName}
                                onSelect={(currentValue) => {
                                  handleGuessCharacter(currentValue, index);
                                  setOpenCharacterSearch(null);
                                }}
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleGuessCharacter(characterName, index);
                                  setOpenCharacterSearch(null);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Escape") {
                                    setOpenCharacterSearch(null);
                                  }
                                }}
                              >
                                {characterName}
                              </CommandItem>
                            ))}
                          </CommandList>
                        ) : (
                          <CommandList></CommandList>
                        )}
                      </Command>
                    </div>

                    <div className="rounded-lg drop-shadow-sm w-full">
                      {/* Anime Input */}
                      <Command loop>
                        <CommandInput
                          value={animeInput[index]}
                          onValueChange={(value) => {
                            handleAnimeInput(value, index);
                          }}
                          placeholder="Enter anime name..."
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              setOpenAnimeSearch(null);
                            }
                          }}
                        />

                        {openAnimeSearch === index && animeInput[index] ? (
                          <CommandList
                            ref={commandAnimeRef}
                            className="absolute top-10 w-full bg-background drop-shadow-sm rounded-sm z-50 max-h-[225px] transition-transform ease duration-300 translate-y-1"
                          >
                            {filteredAnimes.map((anime, innerIndex) => (
                              <CommandItem
                                key={innerIndex}
                                value={anime}
                                onSelect={(currentValue) => {
                                  handleGuessAnime(currentValue, index);
                                  setOpenAnimeSearch(null);
                                }}
                                onMouseDown={(event) => {
                                  event.preventDefault();
                                  handleGuessAnime(anime, index);
                                  setOpenAnimeSearch(null);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Escape") {
                                    setOpenAnimeSearch(null);
                                  }
                                }}
                              >
                                {anime}
                              </CommandItem>
                            ))}
                          </CommandList>
                        ) : (
                          <>
                            <CommandList></CommandList>
                          </>
                        )}
                      </Command>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-rows-[1fr_2fr] items-center text-center font-semibold text-sm ">
                    <p
                      className={
                        guessedCharacters[index].guessed ? "text-green-500" : "text-red-500"
                      }
                    >
                      {character.name}
                    </p>
                    <p className={guessedAnimes[index].guessed ? "text-green-500" : "text-red-500"}>
                      {charactersToGuess[index].title.english}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-x-6 mt-5">
          {!isGameFinished && (
            <ButtonRipple className="cursor-pointer" onClick={submitGuess}>
              Guess
            </ButtonRipple>
          )}
          <ButtonRipple className="cursor-pointer" onClick={handleRestartGame}>
            Re-shuffle
          </ButtonRipple>
        </div>
      </div>
    </div>
  );
};
