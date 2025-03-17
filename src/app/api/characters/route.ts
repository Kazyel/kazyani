import { NextRequest, NextResponse } from "next/server";

import data from "@/data/franchiseList.json";
import { SerializedFranchiseList } from "@/types";

export async function GET(req: NextRequest, res: NextResponse) {
  const animes: SerializedFranchiseList = JSON.parse(JSON.stringify(data));

  const parseAnimeIds = () => {
    const animesData: string[] = [];

    for (const [key, data] of Object.entries(animes)) {
      animesData.push(data.mainTitle);
    }

    return animesData;
  };

  const animeIds = parseAnimeIds();

  const returnFourRandomIds = () => {
    const randomIndexes: string[] = [];

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * animeIds.length);
      const randomAnime = animeIds[randomIndex];

      randomIndexes.push(randomAnime);
    }

    return randomIndexes;
  };

  const randomIds = returnFourRandomIds();

  return NextResponse.json(randomIds);
}
