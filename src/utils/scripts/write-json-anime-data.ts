import { FranchiseList } from "@/lib/types";

import fs from "fs";

export const writeJSONAnimeData = (franchiseList: FranchiseList) => {
  if (fs.existsSync("./src/data/franchiseList.json")) {
    const storedFranchiseList: FranchiseList = JSON.parse(
      fs.readFileSync("./src/data/franchiseList.json", "utf8")
    );

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

    fs.writeFileSync("./src/data/franchiseList.json", JSON.stringify(storedFranchiseList, null, 2));
  }

  if (!fs.existsSync("./src/data/franchiseList.json")) {
    fs.writeFileSync("./src/data/franchiseList.json", JSON.stringify(franchiseList, null, 2));
  }
};
