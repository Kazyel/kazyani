import { buildFranchiseList, serializeFranchiseList } from "@/app/api/animes/route";

import { FranchiseList, SerializedFranchiseList } from "@/types";
import { AnimeRequestData } from "@/types/api";

import fs from "fs";

export const writeJSONAnimeData = (animes: AnimeRequestData[]) => {
  const franchiseList: FranchiseList = buildFranchiseList(animes);
  const serializedFranchiseList: SerializedFranchiseList = serializeFranchiseList(franchiseList);

  if (fs.existsSync("./src/data/franchiseList.json")) {
    const storedFranchiseList: SerializedFranchiseList = JSON.parse(
      fs.readFileSync("./src/data/franchiseList.json", "utf8")
    );

    const newFranchiseList: FranchiseList = buildFranchiseList(animes);

    const serialized: SerializedFranchiseList = serializeFranchiseList(newFranchiseList);

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

    fs.writeFileSync("./src/data/franchiseList.json", JSON.stringify(storedFranchiseList, null, 2));
  }

  if (!fs.existsSync("./src/data/franchiseList.json")) {
    fs.writeFileSync(
      "./src/data/franchiseList.json",
      JSON.stringify(serializedFranchiseList, null, 2)
    );
  }
};
