"use client";

import { CharactersResponse } from "@/lib/types/api";
import { CharacterPortrait } from "./character-portrait";

interface CharacterListProps {
  data: CharactersResponse;
  franchiseNames: string[];
  characterNames: string[];
}

export const CharacterList = ({ data, franchiseNames, characterNames }: CharacterListProps) => {
  const characters = Object.values(data);

  return (
    <>
      {!data && (
        <div className="flex flex-col gap-y-4 max-w-[200px]">
          <h1 className="text-xl font-bold">No data available</h1>
        </div>
      )}

      {data &&
        characters.map((character) => {
          return (
            <div key={character?.characterId} className="flex flex-col gap-y-4 max-w-[200px]">
              <CharacterPortrait image={character && character.characterImage} />

              <h1 className="text-xl font-bold truncate">
                {character?.animeRomaji ?? character?.animeEnglish}
              </h1>

              <p className="italic">{character?.characterName}</p>
              <p>{character?.favourites}</p>
            </div>
          );
        })}
    </>
  );
};
