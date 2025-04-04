import { FranchiseList } from "@/types";
import { FranchiseDatabaseList } from "../sql/insert-new-animes";

import fs from "fs";

export const writeJSONAnimeData = (
  franchiseList: FranchiseList | FranchiseDatabaseList,
  filePath: string = "./src/data/franchiseList.json"
) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(franchiseList, null, 2));
  }
};
