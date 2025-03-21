import type { FranchiseList } from "@/lib/types";
import type { AnimeRequest, AnimeRequestData, CharactersResponse } from "@/lib/types/api";

import { NextResponse } from "next/server";
import { anilistClient } from "@/app/layout";
import { gql } from "@apollo/client";

import storedJson from "@/data/franchiseList.json";
import { shuffle } from "lodash";

const DATABASE_ANIMES: FranchiseList = JSON.parse(JSON.stringify(storedJson));

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
  const selectedAnimes: string[] = [];

  const normalizedAnimeNames = animeNames.map((anime) =>
    anime.toLowerCase().replace(/[\s★\W]/g, "")
  );

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * animeNames.length);
    const randomAnime = normalizedAnimeNames[randomIndex];

    selectedAnimes.push(randomAnime);
  }

  return selectedAnimes;
};
const buildCharactersResponse = async (animes: AnimeRequestData[]): Promise<CharactersResponse> => {
  const charactersResponse: CharactersResponse = {};
  const usedCharacterIds = new Set<number>();

  for (let i = 0; i < animes.length; i++) {
    const anime = animes[i];

    const animeCharacters = anime.characters.nodes.filter(
      (character) => character.name.full.toLowerCase() !== "narrator"
    );

    let randomCharacterIndex = Math.floor(Math.random() * animeCharacters.length);
    let selectedCharacter = animeCharacters[randomCharacterIndex];

    while (usedCharacterIds.has(selectedCharacter.id)) {
      randomCharacterIndex = Math.floor(Math.random() * animeCharacters.length);
      selectedCharacter = animeCharacters[randomCharacterIndex];
    }

    usedCharacterIds.add(selectedCharacter.id);

    const sumOfFavourites = animeCharacters.reduce(
      (acc, character) => acc + character.favourites,
      0
    );

    while (selectedCharacter.favourites < sumOfFavourites / 6.5) {
      selectedCharacter = animeCharacters.find(
        (character) => character.favourites > selectedCharacter.favourites
      )!;
    }

    charactersResponse[`${i}`] = {
      animeRomaji: anime.title.romaji,
      animeEnglish: anime.title.english,
      characterId: selectedCharacter.id,
      characterName: selectedCharacter.name.full,
      characterImage: selectedCharacter.image.large,
      favourites: selectedCharacter.favourites,
    };
  }

  return charactersResponse;
};

export async function GET() {
  const animeNames = parseAnimeNames(DATABASE_ANIMES);
  const randomAnimes = getFourRandomAnimes(shuffle(animeNames));

  console.log(randomAnimes);

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
