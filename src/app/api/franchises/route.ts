import type { FranchiseList } from "@/types";
import type { FranchiseRequest, FranchiseRequestData } from "@/types/api";

import { NextRequest, NextResponse } from "next/server";

import { gql } from "@apollo/client";
import { shikimoriClient } from "@/app/layout";

import { normalizeFranchise } from "@/lib/utils/api";

const buildAnimesQuery = (pageCount: number, pageOffset: number) => {
  const pages = [...Array(pageCount)].map((_, i) => {
    const pageNumber = i + 1 + pageOffset;

    return `
      page${pageNumber}: animes(page: ${pageNumber}, limit: 50, order: popularity) {
        malId
        name
        english
        franchise
      }
    `;
  });

  return `query { ${pages.join("\n")} }`;
};

const fetchAnimesData = async (pageCount: number, pageOffset: number) => {
  try {
    const { data } = await shikimoriClient.query<FranchiseRequest>({
      query: gql(buildAnimesQuery(pageCount, pageOffset)),
      context: {
        uri: "https://shikimori.one/api/graphql",
      },
    });

    return Object.values(data).flat();
  } catch (error) {
    console.error("Failed to fetch anime data from the API:", error);
    return null;
  }
};

export const addToFranchiseList = (
  anime: FranchiseRequestData,
  franchiseList: FranchiseList,
  franchise: string,
  popularityRank: number
) => {
  const franchiseEntry = franchiseList[franchise] ?? {
    popularityRank,
    id: anime.malId,
    main: franchise,
    mainTitle: anime.name,
    englishTitle: anime.english,
    synonyms: [],
  };

  franchiseEntry.synonyms.push(anime.name);
  franchiseList[franchise] = franchiseEntry;
};

export const buildFranchiseList = (animes: FranchiseRequestData[]) => {
  return animes.reduce((acc, anime, popularityRank) => {
    const franchiseName = anime.franchise ? anime.franchise : normalizeFranchise(anime.name);

    addToFranchiseList(anime, acc, franchiseName, popularityRank);

    return acc;
  }, {});
};

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;
  const pageCount = searchParams.get("pageCount");
  const pageOffset = searchParams.get("pageOffset");

  if (!Number.isInteger(Number(pageCount))) {
    return NextResponse.json({
      error: "Invalid anime count provided, must be a valid integer.",
      status: 400,
    });
  }

  let pageCountNumber = Number(pageCount) || 1;
  let pageOffsetNumber = Number(pageOffset) || 0;

  if (!Number.isInteger(pageOffsetNumber)) {
    return NextResponse.json({
      error: "Invalid page offset provided, must be a non-negative integer.",
      status: 400,
    });
  }

  const animesData = await fetchAnimesData(pageCountNumber, pageOffsetNumber);

  if (!animesData) {
    return NextResponse.json({
      error: "No data returned from the API. Please try again later.",
      status: 500,
    });
  }

  const franchiseList: FranchiseList = buildFranchiseList(animesData);

  // writeJSONAnimeData(franchiseList);

  return NextResponse.json<FranchiseList>(franchiseList);
}
