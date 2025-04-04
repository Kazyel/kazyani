import getDatabase from "../db";
import { AnimeDatabaseEntry } from "../models/anime-entry";
import { AnimeJikanEntry } from "../models/jikan-requests";
import { writeJSONAnimeData } from "./json/write-json-anime-data";

const db = getDatabase();

const getAnimes = db.prepare<Pick<AnimeDatabaseEntry, "malId">, []>(`
  SELECT malId FROM animes;  
`);

const animes = getAnimes.all();
const dataList: AnimeJikanEntry[] = [];

const fetchAnimesData = async (id: number) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data: AnimeJikanEntry = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch anime data from the API:", error);
    return null;
  }
};
const MAX_REQUESTS_PER_MINUTE = 60;
const BATCH_SIZE = 2;
const requestTimestamps: number[] = [];
const BASE_DELAY_MS = 3000;

for (let i = 0; i < animes.length; i += BATCH_SIZE) {
  const batch = animes.slice(i, i + BATCH_SIZE);

  // Clean up old timestamps
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  // Check if we're approaching the rate limit
  if (requestTimestamps.length + BATCH_SIZE >= MAX_REQUESTS_PER_MINUTE) {
    const oldestRequestTime = requestTimestamps[0];
    const timeToWait = oldestRequestTime + 65000 - now; // Added 5000ms buffer
    console.log(`Approaching rate limit. Waiting ${timeToWait}ms...`);
    await new Promise((resolve) => setTimeout(resolve, timeToWait));

    // Re-clean timestamps after waiting
    const newNow = Date.now();
    const newOneMinuteAgo = newNow - 60000;
    while (requestTimestamps.length > 0 && requestTimestamps[0] < newOneMinuteAgo) {
      requestTimestamps.shift();
    }
  }

  // Process the batch
  const batchResults = await Promise.all(batch.map((anime) => fetchAnimesData(anime.malId)));
  requestTimestamps.push(...Array(BATCH_SIZE).fill(Date.now()));

  const successfulData = batchResults.filter(Boolean) as AnimeJikanEntry[];
  dataList.push(...successfulData);

  console.log(`Processed batch ${i / BATCH_SIZE + 1}/${Math.ceil(animes.length / BATCH_SIZE)}`);

  // Add a small delay between batches even when not near limit
  if (i + BATCH_SIZE < animes.length) {
    await new Promise((resolve) => setTimeout(resolve, BASE_DELAY_MS));
  }
}

console.log("Completed. Total fetched:", dataList.length);

writeJSONAnimeData(dataList, "./data/jikan-request.json");
