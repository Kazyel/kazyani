import type { ShikimoriRequest } from "../../models/shikimori-requests";
import type { AnimeDatabaseEntry } from "../../models/anime-entry";

import storedJson from "@/sql/data/shikimori-request.json";
import getDatabase from "../../db";

const FRANCHISES: ShikimoriRequest = JSON.parse(JSON.stringify(storedJson));
const db = getDatabase();

const getEntries = db.prepare<Pick<AnimeDatabaseEntry, "franchise">, []>(`
  SELECT franchise FROM animes;
`);

const insertScores = db.prepare(`
  UPDATE animes 
  SET score = $score
  WHERE franchise = $franchise;
`);

export const getAnimeEntries = () => {
  const animeNames = getEntries.all();
  return animeNames;
};

const allAnimes = getAnimeEntries();

for (const anime of allAnimes) {
  if (FRANCHISES[anime.franchise]) {
    insertScores.run(FRANCHISES[anime.franchise].score, anime.franchise);
  }
}
