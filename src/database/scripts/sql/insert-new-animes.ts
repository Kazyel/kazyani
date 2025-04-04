import type { AnimeDatabaseEntry } from "@/database/models/anime-entry";
import type { AnimeShikimoriEntry } from "@/database/models/shikimori-requests";

import storedRequest from "@/sql/data/shikimori-request.json";
import getDatabase from "@/database/db";

const animesRequest: AnimeShikimoriEntry[] = JSON.parse(JSON.stringify(storedRequest));

const db = getDatabase();

const insertAnime = db.prepare(`
  INSERT INTO animes (
    malId,
    jp_title, 
    en_title, 
    genres,
    studios, 
    images, 
    synonyms, 
    franchise, 
    score,
    airedOn,
    source,
    opening_links,
    difficulty
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?);
`);

const insertMany = db.transaction((franchises: AnimeDatabaseEntry[]) => {
  for (const [_, franchiseEntry] of Object.entries(franchises)) {
    try {
      const {
        malId,
        jp_title,
        en_title,
        franchise_entries,
        franchise,
        airedOn,
        genres,
        studios,
        score,
        source,
        difficulty,
      } = franchiseEntry;

      insertAnime.run(
        malId,
        jp_title,
        en_title,
        genres,
        studios,
        null, // images
        franchise_entries,
        franchise,
        score,
        airedOn,
        source,
        null, // opening_links
        difficulty
      );
    } catch (error) {
      console.error(`Failed to insert ${franchiseEntry.en_title}:`, error);
      throw error;
    }
  }
});

try {
  insertMany(animesRequest);
  console.log(`Successfully inserted ${animesRequest.length} franchises`);
} catch (error) {
  console.error("Transaction failed:", error);
} finally {
  db.close();
}
