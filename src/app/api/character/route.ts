import { NextRequest, NextResponse } from "next/server";
import { apolloClient } from "@/app/layout";
import { gql } from "@apollo/client";

type AnimeData = {
  id: number;
  malId: number;
  name: string;
  franchise: string;
};

type AnimesList = AnimeData[];

type PageResponse = {
  [key: string]: AnimesList;
};

type Franchises = {
  main: string;
  synonyms: string[];
};

type AnimeFranchiseList = {
  [key: string]: Franchises;
};

export async function GET(req: NextRequest, res: NextResponse) {
  const pageCount = req.nextUrl.searchParams.get("pageCount");

  if (!pageCount) {
    return NextResponse.json({ error: "No anime count provided.", status: 400 });
  }

  let query = `query {`;

  for (let i = 1; i <= Number(pageCount); i++) {
    query += `
        page${i}: animes(page: ${i}, limit:50, order: popularity) {
          id
          malId
          name
          franchise
        }
    `;
  }

  query += `}`;

  const { data } = await apolloClient.query<PageResponse>({
    query: gql(query),
  });

  const animes: AnimesList = Object.values(data).flat();
  const franchiseList: AnimeFranchiseList = {};

  const normaliseFranchise = (franchise: string) => {
    return franchise.replace(/[\s-]+/g, "_").toLowerCase();
  };

  animes.forEach((anime) => {
    if (!anime.franchise) {
      const franchiseName = normaliseFranchise(anime.name);

      franchiseList[franchiseName] = { main: franchiseName, synonyms: [] };
      franchiseList[franchiseName].synonyms.push(anime.name);

      return;
    }

    if (!franchiseList[anime.franchise]) {
      franchiseList[anime.franchise] = { main: anime.franchise, synonyms: [] };
    }

    franchiseList[anime.franchise].synonyms.push(anime.name);
  });

  return NextResponse.json(franchiseList);
}
