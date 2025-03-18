import type { AnimeMediaData, SerializedFranchiseList } from "@/types";

import { NextResponse } from "next/server";

import data from "@/data/franchiseList.json";
import { anilistClient } from "@/app/layout";
import { gql } from "@apollo/client";
import { AnimeRequestData, AnimesMediaResponse } from "@/types/api";

const buildAnimeQuery = (animes: string[]) => {
  const animesData = Array.from(animes).map((_, i) => {
    return `
     anime${i}: Media (search: "${animes[i]}", sort: $mediaSort) {
        id
        idMal
        title {
          english
          romaji
        }
        siteUrl

        characters(sort: $sort) {
          nodes {
            name {
              full
            }
          }
        }
  	}
    `;
  });

  return `query($sort: [CharacterSort], $mediaSort: [MediaSort]) { ${animesData.join("\n")} } `;
};

const fetchAnimeData = async (animes: string[]) => {
  try {
    const { data } = await anilistClient.query<AnimeRequestData[]>({
      query: gql(buildAnimeQuery(animes)),
      variables: {
        sort: "FAVOURITES_DESC",
        mediaSort: "FAVOURITES_DESC",
      },
    });

    return Object.values(data).flat();
  } catch (error) {
    console.error("Failed to fetch anime data from the API:", error);
    return null;
  }
};

const getFourRandomAnimes = (animeNames: string[]) => {
  const randomIndexes: string[] = [];

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * animeNames.length);
    const randomAnime = animeNames[randomIndex];

    randomIndexes.push(randomAnime);
  }

  return randomIndexes;
};

const parseAnimeNames = (animes: SerializedFranchiseList) => {
  const animesData: string[] = [];

  for (const [_, data] of Object.entries(animes)) {
    animesData.push(data.mainTitle);
  }

  return animesData;
};

export async function GET() {
  const animes: SerializedFranchiseList = JSON.parse(JSON.stringify(data));

  const animeNames = parseAnimeNames(animes);
  const randomAnimes = getFourRandomAnimes(animeNames);

  const animesData = await fetchAnimeData(randomAnimes);

  if (!animesData) {
    return NextResponse.json({
      error: "No data returned from the API. Please try again later.",
      status: 500,
    });
  }

  const animesMedia: AnimeMediaData[] = animesData.map((anime) => {
    return {
      ...anime,
      characters: anime.characters.nodes
        .map((character) => ({
          name: {
            full: character.name.full,
          },
        }))
        .filter((char) => char.name.full.toLowerCase() !== "narrator"),
    };
  });

  return NextResponse.json<AnimesMediaResponse>(animesMedia);
}
