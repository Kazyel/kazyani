import getDatabase from "../db";

import { Franchise } from "@/lib/types";
import storedFranchiseNamesJson from "@/sql/data/franchiseList.json";

const FRANCHISES: Franchise[] = JSON.parse(JSON.stringify(storedFranchiseNamesJson));

const db = getDatabase();

const insertAnime = db.prepare(`
  INSERT INTO animes (
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
  ) VALUES (?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?);
`);

const insertMany = db.transaction((franchises: Franchise[]) => {
  for (const [_, franchise] of Object.entries(franchises)) {
    try {
      const { mainTitle, englishTitle, synonyms, main, airedOn, genres, studios } = franchise;

      const result = insertAnime.run(
        mainTitle, // jp_title
        englishTitle, // en_title
        JSON.stringify(genres), // genres
        JSON.stringify(studios), // studios
        null, // images
        JSON.stringify(synonyms), // synonyms
        main, // franchise
        null, // score
        airedOn, // airedOn
        null, // source
        null, // opening_links
        null // difficulty
      );
    } catch (error) {
      console.error(`Failed to insert ${franchise.mainTitle}:`, error);
      throw error;
    }
  }
});

try {
  insertMany(FRANCHISES);
  console.log(`Successfully inserted ${FRANCHISES.length} franchises`);
} catch (error) {
  console.error("Transaction failed:", error);
} finally {
  db.close();
}
