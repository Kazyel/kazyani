"use client";
import { useState } from "react";
import type { CharactersResponse } from "@/lib/types/api";
import { CharacterPortrait } from "./character-portrait";
import { ComboBox } from "@/components/combo-box";
import { Button } from "@/components/ui/button";

interface CharacterListProps {
  data: CharactersResponse;
  animeNames: string[];
  characterNames: string[];
}

type Selection = {
  character: { characterName: string; isCorrect: boolean } | null;
  anime: { animeName: string; isCorrect: boolean } | null;
};

export const CharacterGame = ({ data, animeNames, characterNames }: CharacterListProps) => {
  const charactersToGuess = Object.values(data);

  const [selections, setSelections] = useState<Selection[]>(
    Array(charactersToGuess.length).fill({ character: null, anime: null })
  );

  const [showHints, setShowHints] = useState<boolean>(false);

  const handleCharacterSelect = (value: string, index: number) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        character: { characterName: value, isCorrect: false },
      };
      return newSelections;
    });
    setShowHints(false);
  };

  const handleAnimeSelect = (value: string, index: number) => {
    setSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        anime: { animeName: value, isCorrect: false },
      };
      return newSelections;
    });
    setShowHints(false);
  };

  const handleCheckAnswers = () => {
    const hasEmptySelections = selections.some(
      (selection) => !selection.character || !selection.anime
    );

    if (hasEmptySelections) {
      setShowHints(true);
      return;
    }

    const updatedSelections = selections.map((selection, index) => {
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
    });

    setSelections(updatedSelections);
  };

  return (
    <>
      {!data && (
        <div className="flex flex-col gap-y-4 max-w-[200px]">
          <h1 className="text-xl font-bold">No data available</h1>
        </div>
      )}

      {data && (
        <div className="gap-x-10 flex justify-center">
          {charactersToGuess.map((character, index) => (
            <div key={character?.characterId} className="flex flex-col gap-y-6 max-w-[200px]">
              <CharacterPortrait image={character?.characterImage!} />

              <ComboBox
                data={characterNames}
                placeholder="Search character..."
                showHint={showHints && !selections[index].character}
                isCorrect={selections[index].character?.isCorrect ?? false}
                onSelect={(value) => handleCharacterSelect(value, index)}
              />

              <ComboBox
                data={animeNames}
                placeholder="Search anime..."
                showHint={showHints && !selections[index].anime}
                isCorrect={selections[index].anime?.isCorrect ?? false}
                onSelect={(value) => handleAnimeSelect(value, index)}
              />
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleCheckAnswers}>Guess</Button>
    </>
  );
};
