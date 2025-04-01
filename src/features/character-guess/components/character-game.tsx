"use client";

import type { CharacterInfo } from "@/lib/types/api";

import { CharacterPortrait } from "./character-portrait";
import { ComboBox } from "@/components/combo-box";
import { ButtonRipple } from "@/components/button-ripple";

import { useState } from "react";

interface CharacterListProps {
  charactersToGuess: CharacterInfo[];
  animeNames: string[];
  characterNames: string[];
}

type Selection = {
  character: { characterName: string | null; isCorrect: boolean; isInvalid: boolean };
  anime: { animeName: string | null; isCorrect: boolean; isInvalid: boolean };
};

export const CharacterGame = ({
  charactersToGuess,
  animeNames,
  characterNames,
}: CharacterListProps) => {
  const [selections, setSelections] = useState<Selection[]>(
    Array(charactersToGuess.length).fill({
      character: { characterNames: null, isCorrect: false, isInvalid: false },
      anime: { animeNames: null, isCorrect: false, isInvalid: false },
    })
  );

  const [showHints, setShowHints] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  const handleCharacterSelect = (value: string, index: number) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        character: {
          characterName: value,
          isCorrect: false,
          isInvalid: handleCharacterIsInvalid(value),
        },
      };
      return newSelections;
    });
  };

  const handleAnimeSelect = (value: string, index: number) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        anime: { animeName: value, isCorrect: false, isInvalid: handleAnimeIsInvalid(value) },
      };
      return newSelections;
    });
  };

  const handleCharacterIsCorrect = (selection: Selection, correctChar: CharacterInfo) => {
    return (
      selection.character?.characterName?.toLowerCase() ===
      correctChar!.characterName?.toLowerCase()
    );
  };

  const handleAnimeIsCorrect = (selection: Selection, correctChar: CharacterInfo) => {
    if (!correctChar?.animeEnglish) {
      return selection.anime?.animeName?.toLowerCase() === correctChar!.animeRomaji?.toLowerCase();
    }

    return (
      selection.anime?.animeName?.toLowerCase() === correctChar!.animeRomaji?.toLowerCase() ||
      selection.anime?.animeName?.toLowerCase() === correctChar!.animeEnglish?.toLowerCase()
    );
  };

  const handleCharacterIsInvalid = (character: string | null) => {
    if (!character) return false;
    return !characterNames.includes(character);
  };

  const handleAnimeIsInvalid = (anime: string | null) => {
    if (!anime) return false;
    return !animeNames.includes(anime);
  };

  const handleCheckAnswers = async () => {
    const updatedSelections = selections.map((selection, index) => {
      const correctChar = charactersToGuess[index];
      if (!correctChar) return selection;

      return {
        character: {
          characterName: selection.character?.characterName ?? null,
          isCorrect: handleCharacterIsCorrect(selection, correctChar),
          isInvalid: handleCharacterIsInvalid(selection.character?.characterName),
        },
        anime: {
          animeName: selection.anime?.animeName ?? null,
          isCorrect: handleAnimeIsCorrect(selection, correctChar),
          isInvalid: handleAnimeIsInvalid(selection.anime?.animeName),
        },
      };
    });

    const invalidExists = updatedSelections.some(
      (selection) => selection.character?.isInvalid || selection.anime?.isInvalid
    );

    setSelections(updatedSelections);

    if (invalidExists) {
      setShowHints(invalidExists);
      setHasChecked(false);
      return;
    }

    setHasChecked(true);
  };

  return (
    <section className="flex justify-center flex-col items-center gap-y-8">
      <div>
        {!charactersToGuess && (
          <div className="flex flex-col gap-y-4 max-w-[200px]">
            <h1 className="text-xl font-bold">No data available</h1>
          </div>
        )}

        {charactersToGuess && (
          <div className="gap-x-10 flex justify-center">
            {charactersToGuess.map((character, index) => (
              <div key={character?.characterId} className="flex flex-col gap-y-6 max-w-[200px]">
                <CharacterPortrait image={character?.characterImage!} />

                <ComboBox
                  data={characterNames}
                  placeholder="Search character..."
                  hasChecked={hasChecked}
                  isCorrect={selections[index].character?.isCorrect ?? false}
                  showHint={showHints && selections[index].character?.isInvalid}
                  onSelect={(value) => handleCharacterSelect(value, index)}
                  onChange={(value) => handleCharacterSelect(value, index)}
                />

                <ComboBox
                  data={animeNames}
                  placeholder="Search anime..."
                  hasChecked={hasChecked}
                  isCorrect={selections[index].anime?.isCorrect ?? false}
                  showHint={showHints && selections[index].anime?.isInvalid}
                  onSelect={(value) => handleAnimeSelect(value, index)}
                  onChange={(value) => handleAnimeSelect(value, index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ButtonRipple
        className="rounded-xs bg-indigo-500 text-foreground hover:bg-indigo-400 cursor-pointer px-8 py-4"
        onClick={handleCheckAnswers}
      >
        Guess
      </ButtonRipple>
    </section>
  );
};
