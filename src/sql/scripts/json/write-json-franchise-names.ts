import { FranchiseList } from "../../../lib/types";
import fs from "fs";

const storedFranchiseList: FranchiseList = JSON.parse(
  fs.readFileSync("./src/data/franchiseList.json", "utf8")
);

export const parseFranchiseNames = (
  animeList: FranchiseList,
  writeData: boolean = false
): string[] => {
  const animeNames: string[] = [];

  for (const [_, anime] of Object.entries(animeList)) {
    animeNames.push(anime.mainTitle);

    if (anime.englishTitle && !animeNames.includes(anime.englishTitle)) {
      animeNames.push(anime.englishTitle);
    }
  }

  if (writeData) writeNamesData(animeNames);

  return animeNames;
};

const writeNamesData = (animeNames: string[]) => {
  if (!fs.existsSync("./src/data/franchiseNames.json")) {
    fs.writeFileSync("./src/data/franchiseNames.json", JSON.stringify(animeNames, null, 2));
  }

  if (fs.existsSync("./src/data/franchiseNames.json")) {
    const storedAnimeNames: string[] = JSON.parse(
      fs.readFileSync("./src/data/franchiseNames.json", "utf8")
    );

    for (const animeName of animeNames) {
      if (!storedAnimeNames.includes(animeName)) {
        storedAnimeNames.push(animeName);
      }
    }

    fs.writeFileSync("./src/data/franchiseNames.json", JSON.stringify(storedAnimeNames, null, 2));
  }
};

parseFranchiseNames(storedFranchiseList, true);
