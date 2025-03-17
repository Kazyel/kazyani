import { FranchiseList, InMemoryFranchise, SerializedFranchiseList } from "@/types";
import { AnimeRequest, AnimeRequestData, AnimeResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

import fs from "fs";

import { apolloClient } from "@/app/layout";
import { gql } from "@apollo/client";

import { writeJSONAnimeData } from "@/lib/scripts/write-json-anime-data";

const buildAnimesQuery = (pageCount: number, pageOffset: number) => {
  const pages = [...Array(pageCount)].map((_, i) => {
    const pageNumber = i + 1 + pageOffset;

    return `
      page${pageNumber}: animes(page: ${pageNumber}, limit: 50, order: popularity) {
        malId
        name
        franchise
        characterRoles {
          character {
            id
          }
        }
      }
    `;
  });

  return `query { ${pages.join("\n")} }`;
};

const fetchAnimesData = async (pageCount: number, pageOffset: number) => {
  try {
    const { data } = await apolloClient.query<AnimeRequest>({
      query: gql(buildAnimesQuery(pageCount, pageOffset)),
    });

    return Object.values(data).flat();
  } catch (error) {
    console.error("Failed to fetch anime data from the API:", error);
    return null;
  }
};

export const addToFranchiseList = (
  anime: AnimeRequestData,
  franchiseList: FranchiseList,
  franchise: string,
  popularityRank: number
) => {
  const franchiseEntry = franchiseList.get(franchise) ?? {
    popularityRank,
    id: anime.malId,
    main: franchise,
    mainTitle: anime.name,
    franchiseCharacters: new Set<number>(),
    synonyms: [],
  };

  anime.characterRoles.forEach((role) => franchiseEntry.franchiseCharacters.add(role.character.id));
  franchiseEntry.synonyms.push(anime.name);
  franchiseList.set(franchise, franchiseEntry);
};

const normalizeFranchise = (franchise: string) => {
  return franchise.replace(/[\s-]+/g, "_").toLowerCase();
};

export const buildFranchiseList = (animes: AnimeRequestData[]) => {
  return animes.reduce((acc, anime, popularityRank) => {
    const franchiseName = anime.franchise ? anime.franchise : normalizeFranchise(anime.name);

    addToFranchiseList(anime, acc, franchiseName, popularityRank);

    return acc;
  }, new Map<string, InMemoryFranchise>());
};

export const serializeFranchiseList = (franchiseList: FranchiseList) => {
  const serialized: SerializedFranchiseList = {};

  for (const [franchise, data] of franchiseList.entries()) {
    const { popularityRank, id, main, mainTitle, franchiseCharacters, synonyms } = data;

    serialized[franchise] = {
      popularityRank,
      id,
      main,
      mainTitle,
      franchiseCharacters: Array.from(franchiseCharacters).sort((a, b) => a - b),
      synonyms,
    };
  }

  return serialized;
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

  // writeJSONAnimeData(animesData);

  const serializedFranchiseList: SerializedFranchiseList = serializeFranchiseList(franchiseList);

  return NextResponse.json<AnimeResponse>({
    franchiseList: serializedFranchiseList,
  });
}
