"use client";

import { CharactersResponse } from "@/lib/types/api";
import { CharacterPortrait } from "./character-portrait";

import { ComboBox } from "@/components/combo-box";

interface CharacterListProps {
  data: CharactersResponse;
  franchiseNames: string[];
  characterNames: string[];
}

export const CharacterList = ({ data, franchiseNames, characterNames }: CharacterListProps) => {
  const charactersToGuess = Object.values(data);

  return (
    <>
      {!data && (
        <div className="flex flex-col gap-y-4 max-w-[200px]">
          <h1 className="text-xl font-bold">No data available</h1>
        </div>
      )}

      {data &&
        charactersToGuess.map((character) => {
          return (
            <div key={character?.characterId} className="flex flex-col gap-y-4 max-w-[200px]">
              <CharacterPortrait image={character && character.characterImage} />

              <h1 className="text-xl font-bold truncate">
                {character?.animeRomaji ?? character?.animeEnglish}
              </h1>

              <p className="italic">{character?.characterName}</p>
              <p>{character?.favourites}</p>

              <ComboBox characterNames={characterNames} placeholder="Search character..." />
            </div>
          );
        })}
    </>
  );
};
