import {
  AnimeRequest,
  AnimeRequestData,
  AnimeResponse,
  Franchise,
  FranchiseList,
  SerializedFranchiseList,
} from "@/types";

import { NextRequest, NextResponse } from "next/server";
import { apolloClient } from "@/app/layout";
import { gql } from "@apollo/client";

export const addToFranchiseList = (
  anime: AnimeRequestData,
  franchiseList: FranchiseList,
  franchise: string
) => {
  if (!franchiseList.has(franchise)) {
    franchiseList.set(franchise, {
      main: franchise,
      franchiseCharacters: new Set<number>(),
      synonyms: [],
    });
  }

  const franchiseEntry = franchiseList.get(franchise)!;
  franchiseEntry.synonyms.push(anime.name);

  for (const character of anime.characterRoles) {
    franchiseEntry.franchiseCharacters.add(character.character.id);
  }
};

const normalizeFranchise = (franchise: string) => {
  return franchise.replace(/[\s-]+/g, "_").toLowerCase();
};

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;
  const pageCount = searchParams.get("pageCount");
  const pageOffset = searchParams.get("pageOffset");

  if (!pageCount) {
    return NextResponse.json({ error: "No anime count provided.", status: 400 });
  }

  let pageCountNumber = Number(pageCount);
  let pageOffsetNumber = Number(pageOffset) || 0;

  let query = `query {`;

  for (let i = 1 + pageOffsetNumber!; i <= pageCountNumber + pageOffsetNumber; i++) {
    query += `
        page${i}: animes(page: ${i}, limit: 50, order: popularity) {
          id
          name
          franchise
          characterRoles {
            character {
              id
            }
          }
        }
    `;
  }

  query += `}`;

  const { data } = await apolloClient.query<AnimeRequest>({
    query: gql(query),
  });

  if (!data) {
    return NextResponse.json({
      error: "No data returned from the API. Please try again later.",
      status: 500,
    });
  }

  const animes: AnimeRequestData[] = Object.values(data).flat();

  const franchiseList: FranchiseList = animes.reduce((acc, anime) => {
    const franchiseName = anime.franchise ? anime.franchise : normalizeFranchise(anime.name);
    addToFranchiseList(anime, acc, franchiseName);
    return acc;
  }, new Map<string, Franchise>());

  const serializedFranchiseList: SerializedFranchiseList = {};

  const allMainAnimes: string[] = [];

  for (const [franchise, data] of franchiseList.entries()) {
    serializedFranchiseList[franchise] = {
      main: data.main,
      franchiseCharacters: [...data.franchiseCharacters].sort((a, b) => a - b),
      synonyms: data.synonyms,
    };

    if (data.synonyms[0]) {
      allMainAnimes.push(data.synonyms[0]);
    }
  }

  allMainAnimes.sort((a, b) => a.localeCompare(b));

  return NextResponse.json<AnimeResponse>({
    franchiseList: serializedFranchiseList,
    allMainAnimes,
  });
}
