import { Database } from "bun:sqlite";

function getDatabase() {
  const db = new Database("./database.db");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA journal_mode = WAL;");
  return db;
}

const initDB = () => {
  const db = getDatabase();

  db.exec(`
   CREATE TABLE IF NOT EXISTS anime_characters (
    anime_id INTEGER NOT NULL,
    character_name TEXT NOT NULL,
    images TEXT,
    synonyms TEXT,
    difficulty TEXT CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
    FOREIGN KEY (anime_id) REFERENCES animes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS animes (
    malId INTEGER NOT NULL,
    jp_title TEXT NOT NULL,
    en_title TEXT,
    genres TEXT,
    studios TEXT,
    images TEXT,
    franchise_entries TEXT,
    franchise TEXT,
    opening_links TEXT,
    score FLOAT,
    airedOn INTEGER,
    source TEXT CHECK(source IN ('Visual Novel', 'Manga', 'Original', 'Light Novel', 'Novel', 'Video Game', '4-Koma Manga', 'Other', 'Web Manga')), 
    difficulty TEXT CHECK(difficulty IN ('Easy', 'Medium', 'Hard'))
  );

  CREATE INDEX IF NOT EXISTS idx_anime_jp_title ON animes(jp_title);
  CREATE INDEX IF NOT EXISTS idx_anime_en_title ON animes(en_title);
  CREATE INDEX IF NOT EXISTS idx_anime_difficulty ON animes(difficulty);
  
  CREATE INDEX IF NOT EXISTS idx_character_anime_id ON anime_characters(anime_id);
  CREATE INDEX IF NOT EXISTS idx_character_name ON anime_characters(character_name);
  CREATE INDEX IF NOT EXISTS idx_character_difficulty ON anime_characters(difficulty);
`);

  db.close();
};

initDB();

export default getDatabase;
