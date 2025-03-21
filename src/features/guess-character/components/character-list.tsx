import { CharactersResponse } from "@/lib/types/api";
import { CharacterPortrait } from "./character-portrait";

interface CharacterListProps {
  data: CharactersResponse;
}

export const CharacterList = async ({ data }: CharacterListProps) => {
  return (
    <>
      {data &&
        Object.values(data).map((character) => {
          return (
            <div key={character.characterId} className="flex flex-col gap-y-4 max-w-[200px]">
              <CharacterPortrait image={character.characterImage} />

              <h1 className="text-xl font-bold truncate">
                {character.animeRomaji ?? character.animeEnglish}
              </h1>

              <p className="italic">{character.characterName}</p>
              <p>{character.favourites}</p>
            </div>
          );
        })}
    </>
  );
};
