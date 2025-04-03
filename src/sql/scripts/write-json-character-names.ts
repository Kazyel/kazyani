import fs from "fs";

export const writeJSONCharacterNames = (characterNames: string[]) => {
  if (!fs.existsSync("./src/data/characterNames.json")) {
    fs.writeFileSync("./src/data/characterNames.json", JSON.stringify(characterNames, null, 2));
  }
};
