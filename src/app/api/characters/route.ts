import type { FranchiseList } from "@/lib/types";
import type { AnimeRequest, AnimeRequestData, CharactersResponse } from "@/lib/types/api";

import { NextResponse } from "next/server";
import { anilistClient } from "@/app/layout";
import { gql } from "@apollo/client";

import storedJson from "@/data/franchiseList.json";

const buildAnimeQuery = (animes: string[]) => {
  const animesData = Array.from(animes).map((_, i) => {
    return `
     anime${i}: Media (search: "${animes[i]}", sort: $mediaSort) {
        idMal

        title {
          english
          romaji
        }
        siteUrl

        characters(sort: $sort) {
          nodes {
            id
             image {
              large
            }
            name {
              native
              full
            }
            favourites
          }
        }
  	}
    `;
  });

  return `query($sort: [CharacterSort], $mediaSort: [MediaSort]) { ${animesData.join("\n")} } `;
};

const fetchAnimeData = async (animes: string[]) => {
  try {
    const { data } = await anilistClient.query<AnimeRequest>({
      query: gql(buildAnimeQuery(animes)),
      variables: {
        sort: "FAVOURITES_DESC",
        mediaSort: "FAVOURITES_DESC",
      },
    });

    return { data: Object.values(data).flat(), status: 200, error: null };
  } catch (error) {
    return { data: null, status: 400, error: error };
  }
};

const parseAnimeNames = (animes: FranchiseList) => {
  const animesData: string[] = [];

  for (const [_, data] of Object.entries(animes)) {
    animesData.push(data.mainTitle);
  }

  return animesData;
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const buildCharactersResponse = async (animes: AnimeRequestData[]): Promise<CharactersResponse> => {
  const charactersResponse: CharactersResponse = {};

  for (let i = 0; i < animes.length; i++) {
    const anime = animes[i];

    const randomCharacterIndex = Math.floor(
      Math.random() * anime.characters.nodes.slice(0, 5).length
    );

    const selectedCharacter = anime.characters.nodes[randomCharacterIndex];

    charactersResponse[anime.title.romaji] = {
      animeName: anime.title.romaji,
      characterId: selectedCharacter.id,
      characterName: selectedCharacter.name.full,
      characterImage: selectedCharacter.image.large,
      favourites: selectedCharacter.favourites,
    };

    if ((i + 1) % 3 === 0) {
      await delay(1000);
    }
  }

  return charactersResponse;
};
export async function GET() {
  const animes: FranchiseList = JSON.parse(JSON.stringify(storedJson));

  const animeNames = parseAnimeNames(animes);
  const randomAnimes = getFourRandomAnimes(animeNames);

  const { data, status, error } = await fetchAnimeData(randomAnimes);

  if (!data) {
    return NextResponse.json({
      message: "No data returned from the API. Please try again later.",
      status,
      error,
    });
  }

  const characterResponse = await buildCharactersResponse(data);

  return NextResponse.json<CharactersResponse>(characterResponse);
}
