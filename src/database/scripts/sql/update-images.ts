import storedJikanAnimeData from "@/sql/data/jikan-request.json";

import getDatabase from "@/database/db";

const db = getDatabase();

const updateAnimeImages = db.prepare(`
  UPDATE animes
  SET images = ?
  WHERE malId = ?;
`);

storedJikanAnimeData.forEach((anime) => {
  updateAnimeImages.run(JSON.stringify(anime.data.images), anime.data.mal_id);
});
