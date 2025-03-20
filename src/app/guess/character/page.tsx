import { CharacterPortrait } from "@/features/guess-character/components/character-portrait";
import { CharactersResponse } from "@/lib/types/api";

export const fetchCharacters = async (): Promise<CharactersResponse> => {
  const response = await fetch("http://localhost:3000/api/characters", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data: CharactersResponse = await response.json();

  if (!data) {
    throw new Error("Failed to parse characters JSON");
  }

  return data;
};

export default async function GuessCharacter() {
  const data = await fetchCharacters();
  console.log(data);

  return (
    <main className="flex justify-center items-center p-16 min-h-screen">
      <div className="flex gap-x-4">
        {data &&
          Object.values(data).map((character) => {
            return (
              <div key={character.characterId} className="flex flex-col gap-y-4 max-w-[200px]">
                <CharacterPortrait image={character.characterImage} />
                <h1 className="text-2xl font-bold truncate">{character.animeName}</h1>
                <p>{character.characterName}</p>
                <p>{character.favourites}</p>
              </div>
            );
          })}
      </div>
    </main>
  );
}
