import getDatabase from "@/lib/database/db";

const db = getDatabase();

const generateInsertCharacterQuery = (characterName: string, animeId: number) => {
  return `
    INSERT INTO anime_characters (character_name, anime_id) VALUES ('${characterName}', ${animeId});  
  `;
};

const generateInsertCharactersQuery = (characterNames: string[], animeId: number) => {
  const queries = characterNames.map((characterName) =>
    generateInsertCharacterQuery(characterName, animeId)
  );

  return queries.join("\n");
};

const insertCharactersQuery = generateInsertCharactersQuery([], 1);

db.exec(insertCharactersQuery);
