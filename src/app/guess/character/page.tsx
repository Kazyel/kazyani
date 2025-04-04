import { CharacterGame } from "@/features/character-guess/components/character-game";
import { CharactersResponse } from "@/types/api";

import storedFranchiseNamesJson from "@/data/franchiseNames.json";
import storedCharacterNamesJson from "@/data/characterNames.json";

const ANIME_NAMES: string[] = JSON.parse(JSON.stringify(storedFranchiseNamesJson));
const CHARACTER_NAMES: string[] = JSON.parse(JSON.stringify(storedCharacterNamesJson));

export const fetchCharacters = async (): Promise<CharactersResponse | null> => {
  const response = await fetch("http://localhost:3000/api/characters", {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch characters");
    return null;
  }

  const data: CharactersResponse = await response.json();

  if (!data) {
    console.error("Failed to parse characters JSON");
    return null;
  }

  return data;
};

export default async function GuessCharacter() {
  const data = await fetchCharacters();

  if (!data) {
    return <div>No data available.</div>;
  }

  const charactersToGuess = Object.values(data);
  const characterNamesSet = new Set(CHARACTER_NAMES);
  const characterNames = Array.from(characterNamesSet);

  return (
    <div className="flex flex-col justify-center items-center size-full gap-y-6">
      <h1 className="font-mono text-3xl font-semibold text-indigo-100">Character Guessing</h1>

      <div className="flex gap-x-4">
        <CharacterGame
          charactersToGuess={charactersToGuess}
          animeNames={ANIME_NAMES}
          characterNames={characterNames}
        />
      </div>
    </div>
  );
}
