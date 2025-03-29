import { CharacterGame } from "@/app/guess/character/character-game";
import { CharactersResponse } from "@/lib/types/api";

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

  return (
    <div className="flex gap-x-4">
      <CharacterGame
        charactersToGuess={charactersToGuess}
        animeNames={ANIME_NAMES}
        characterNames={CHARACTER_NAMES}
      />
    </div>
  );
}
