import {
  addToFranchiseList,
  AnimeFranchiseList,
  AnimesList,
  SerializedFranchiseList,
} from "@/app/api/animes/route";
import fs from "fs";

export const normalizeFranchise = (franchise: string) => {
  return franchise.replace(/[\s-]+/g, "_").toLowerCase();
};

export const writeJSONAnimeData = (animes: AnimesList) => {
  const franchiseList: AnimeFranchiseList = {};
  const allMainAnimes: string[] = [];

  animes.forEach((anime) => {
    if (!anime.franchise) {
      const franchiseName = normalizeFranchise(anime.name);
      addToFranchiseList(anime, franchiseName, franchiseList);
      return;
    }

    addToFranchiseList(anime, anime.franchise, franchiseList);
  });

  Object.keys(franchiseList).forEach((franchise) => {
    const mainAnime = franchiseList[franchise].synonyms[0];

    if (mainAnime) {
      allMainAnimes.push(mainAnime);
    }
  });

  allMainAnimes.sort((a, b) => a.localeCompare(b));

  const serializedFranchiseList: SerializedFranchiseList = {};

  Object.keys(franchiseList).forEach((franchise) => {
    serializedFranchiseList[franchise] = {
      ...franchiseList[franchise],
      franchiseCharacters: [...franchiseList[franchise].franchiseCharacters].sort((a, b) => a - b),
    };
  });

  if (fs.existsSync("./src/constant/franchiseList.json")) {
    const storedFranchiseList: SerializedFranchiseList = JSON.parse(
      fs.readFileSync("./src/constant/franchiseList.json", "utf8")
    );

    const newFranchiseList: AnimeFranchiseList = {};

    for (const anime of animes) {
      if (!anime.franchise) {
        const franchiseName = normalizeFranchise(anime.name);
        addToFranchiseList(anime, franchiseName, newFranchiseList);
      }

      addToFranchiseList(anime, anime.franchise, newFranchiseList);
    }

    const serialized: SerializedFranchiseList = {};

    Object.keys(newFranchiseList).forEach((franchise) => {
      serialized[franchise] = {
        ...newFranchiseList[franchise],
        franchiseCharacters: [...newFranchiseList[franchise].franchiseCharacters].sort(
          (a, b) => a - b
        ),
      };
    });

    for (const franchise of Object.keys(serialized)) {
      if (storedFranchiseList[franchise]) {
        const idSet = new Set<number>([
          ...storedFranchiseList[franchise].franchiseCharacters,
          ...serialized[franchise].franchiseCharacters,
        ]);

        storedFranchiseList[franchise].franchiseCharacters = [...idSet];
        storedFranchiseList[franchise].synonyms = [
          ...storedFranchiseList[franchise].synonyms,
          ...serialized[franchise].synonyms,
        ];
      }

      if (!storedFranchiseList[franchise]) {
        storedFranchiseList[franchise] = serialized[franchise];
      }
    }

    fs.writeFileSync(
      "./src/constant/franchiseList.json",
      JSON.stringify(storedFranchiseList, null, 2)
    );
  }

  if (!fs.existsSync("./src/constant/franchiseList.json")) {
    fs.writeFileSync(
      "./src/constant/franchiseList.json",
      JSON.stringify(serializedFranchiseList, null, 2)
    );
  }
};
