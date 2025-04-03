import { FranchiseList } from "@/lib/types";

import fs from "fs";

export const writeJSONAnimeData = (
  franchiseList: FranchiseList,
  filePath: string = "./src/data/franchiseList.json"
) => {
  if (fs.existsSync(filePath)) {
    const storedFranchiseList: FranchiseList = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const franchise of Object.keys(storedFranchiseList)) {
      if (storedFranchiseList[franchise]) {
        storedFranchiseList[franchise].synonyms = [
          ...storedFranchiseList[franchise].synonyms,
          ...franchiseList[franchise].synonyms,
        ];
      }

      if (!storedFranchiseList[franchise]) {
        storedFranchiseList[franchise] = franchiseList[franchise];
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(storedFranchiseList, null, 2));
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(franchiseList, null, 2));
  }
};
