"use client";

import type { CharacterInfo } from "@/lib/types/api";

import { CharacterPortrait } from "./character-portrait";
import { ComboBox } from "@/components/combo-box";
import { Button } from "@/components/ui/button";

import { useState } from "react";

interface CharacterListProps {
  charactersToGuess: CharacterInfo[];
  animeNames: string[];
  characterNames: string[];
}

type Selection = {
  character: { characterName: string; isCorrect: boolean } | null;
  anime: { animeName: string; isCorrect: boolean } | null;
};

export const CharacterGame = ({
  charactersToGuess,
  animeNames,
  characterNames,
}: CharacterListProps) => {
  const [selections, setSelections] = useState<Selection[]>(
    Array(charactersToGuess.length).fill({ character: null, anime: null })
  );

  const [showHints, setShowHints] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  console.log(selections);
  console.log(charactersToGuess);

  const handleCharacterSelect = (value: string, index: number) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        character: value ? { characterName: value, isCorrect: false } : null,
      };
      return newSelections;
    });
  };

  const handleAnimeSelect = (value: string, index: number) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        anime: value ? { animeName: value, isCorrect: false } : null,
      };
      return newSelections;
    });
  };

  const handleCheckAnswers = () => {
    setHasChecked(true);

    const hasEmptySelections = selections.some(
      (selection) => !selection.character || !selection.anime
    );

    if (hasEmptySelections) {
      setShowHints(true);
      return;
    }

    setSelections((prevSelections) =>
      prevSelections.map((selection, index) => {
        const correctChar = charactersToGuess[index];
        if (!correctChar) return selection;

        return {
          character: {
            characterName: selection.character!.characterName,
            isCorrect: selection.character!.characterName === correctChar.characterName,
          },
          anime: {
            animeName: selection.anime!.animeName,
            isCorrect:
              selection.anime!.animeName === correctChar.animeRomaji ||
              selection.anime!.animeName === correctChar.animeEnglish,
          },
        };
      })
    );
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
                  isCorrect={selections[index].character?.isCorrect ?? false}
                  showHint={showHints && !selections[index].character}
                  onSelect={(value) => handleCharacterSelect(value, index)}
                />

                <ComboBox
                  data={animeNames}
                  placeholder="Search anime..."
                  isCorrect={selections[index].anime?.isCorrect ?? false}
                  showHint={showHints && !selections[index].anime}
                  onSelect={(value) => handleAnimeSelect(value, index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button onClick={handleCheckAnswers}>Guess</Button>
    </section>
  );
};
