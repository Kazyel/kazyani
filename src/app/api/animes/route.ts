import { NextRequest, NextResponse } from "next/server";
import { apolloClient } from "@/app/layout";
import { gql } from "@apollo/client";
import fs from "fs";
import { normalizeFranchise } from "@/lib/write-json-anime-data";

export type AnimeResponse = {
  franchiseList: SerializedFranchiseList;
  allMainAnimes: string[];
};

export type AnimeRequest = {
  [key: string]: AnimesList;
};

export type AnimesList = AnimeRequestData[];

export type AnimeRequestData = {
  id: number;
  malId: number;
  name: string;
  franchise: string;
  characterRoles: {
    character: {
      id: number;
    };
  }[];
};

export type Franchises = {
  main: string;
  franchiseCharacters: Set<number>;
  synonyms: string[];
};

export type SerializedFranchiseList = {
  [key: string]: Omit<Franchises, "franchiseCharacters"> & { franchiseCharacters: number[] };
};

export type AnimeFranchiseList = {
  [key: string]: Franchises;
};

export const addToFranchiseList = (
  anime: AnimeRequestData,
  franchise: string,
  list: AnimeFranchiseList
) => {
  if (!list[franchise]) {
    list[franchise] = {
      main: franchise,
      franchiseCharacters: new Set(),
      synonyms: [],
    };
  }

  list[franchise].synonyms.push(anime.name);

  anime.characterRoles.map((character) => {
    list[franchise].franchiseCharacters.add(character.character.id);
  });
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

  const animes: AnimesList = Object.values(data).flat();
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

  return NextResponse.json<AnimeResponse>({
    franchiseList: serializedFranchiseList,
    allMainAnimes,
  });
}
