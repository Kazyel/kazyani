import type { AnimeDatabaseEntry } from "@/database/models/anime-entry";

import { writeJSONAnimeData } from "@/database/scripts/json/write-json-anime-data";

import getDatabase from "@/database/db";

const db = getDatabase();

const backupFunction = db.query<AnimeDatabaseEntry, []>(`
    SELECT * FROM animes;
`);

const backupData = backupFunction.all();

const backupSerialized: Record<string, AnimeDatabaseEntry> = {};

for (const anime of backupData) {
  const backupObject = {
    malId: anime.malId,
    franchise: anime.franchise,
    en_title: anime.en_title,
    jp_title: anime.jp_title,
    images: anime.images,
    franchise_entries: anime.franchise_entries,
    studios: anime.studios,
    genres: anime.genres,
    opening_links: anime.opening_links,
    airedOn: anime.airedOn,
    score: anime.score,
    source: anime.source,
    difficulty: anime.difficulty,
  };

  backupSerialized[anime.franchise] = backupObject;
}

writeJSONAnimeData(backupSerialized, "./data/backup.json");
