import type { FranchiseList } from "@/lib/types";
import type { AnimeRequest, AnimeRequestData, CharactersResponse } from "@/lib/types/api";

import { NextResponse } from "next/server";
import { shuffle } from "lodash";

import { gql } from "@apollo/client";
import { anilistClient } from "@/app/layout";
import { normalizeNames, parseAnimeNames } from "@/utils/api";

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

const getFourRandomAnimes = (animeNames: string[]) => {
  const selectedAnimes: string[] = [];

  for (let i = 0; i < 4; i++) {
    const randomAnime = animeNames[Math.floor(Math.random() * animeNames.length)];
    selectedAnimes.push(randomAnime);
  }

  return selectedAnimes;
};

const buildCharactersResponse = async (animes: AnimeRequestData[]): Promise<CharactersResponse> => {
  const charactersResponse: CharactersResponse = [];
  const usedCharacterIds = new Set<number>();

  for (const [index, anime] of animes.entries()) {
    const animeCharacters = anime.characters.nodes.filter(
      (character) => character.name.full.toLowerCase() !== "narrator"
    );

    if (animeCharacters.length === 0) {
      console.warn(`No valid characters found for anime: ${anime.title.romaji}`);
      charactersResponse[index] = null;
      continue;
    }

    const sumOfFavourites = animeCharacters.reduce(
      (acc, character) => acc + character.favourites,
      0
    );

    const minFavourites = Math.floor(sumOfFavourites * 0.15);

    const validCharacters = animeCharacters.filter(
      (character) => !usedCharacterIds.has(character.id) && character.favourites >= minFavourites
    );

    if (validCharacters.length === 0) {
      console.warn(`No valid characters above threshold for anime: ${anime.title.romaji}`);
      charactersResponse[index] = null;
      continue;
    }

    const selectedCharacter = validCharacters[Math.floor(Math.random() * validCharacters.length)];

    usedCharacterIds.add(selectedCharacter.id);

    charactersResponse[index] = {
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

const DATABASE_ANIMES: FranchiseList = JSON.parse(JSON.stringify(storedJson));

export async function GET() {
  const animeNames = normalizeNames(parseAnimeNames(DATABASE_ANIMES));
  const randomAnimes = getFourRandomAnimes(shuffle(animeNames));

  console.log("\n\nStart of GET");
  console.log(randomAnimes);

  const { data, status, error } = await fetchAnimeData(randomAnimes);

  if (!data) {
    return NextResponse.json({
      message: "No data returned from the API. Please try again later.",
      status,
      error,
    });
  }

  console.log(data);

  const characterResponse = await buildCharactersResponse(data);

  return NextResponse.json<CharactersResponse>(characterResponse);
}
