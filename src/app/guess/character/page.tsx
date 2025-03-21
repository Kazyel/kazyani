import { CharacterList } from "@/features/guess-character/components/character-list";
import { CharactersResponse } from "@/lib/types/api";

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

  console.log(data);

  return (
    <div className="flex gap-x-4">
      <CharacterList data={data} />
    </div>
  );
}
