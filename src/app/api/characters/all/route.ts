import type { CharacterRequest, CharacterRequestData } from "@/lib/types/api";
import type { FranchiseList } from "@/lib/types";

import { gql } from "@apollo/client";
import { NextResponse } from "next/server";
import { anilistClient } from "@/app/layout";
import { divideIntoBatches, normalizeNames, parseAnimeNames } from "@/utils/api";

import storedJson from "@/data/franchiseList.json";

const buildCharactersQuery = (animes: string[]) => {
  const animesData = Array.from(animes).map((_, i) => {
    return `
     anime${i}: Media (search: "${animes[i]}", sort: $mediaSort) {
        characters(sort: $sort) {
          nodes {
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

const fetchCharacterNames = async (dividedAnimes: string[][]) => {
  try {
    const result = await Promise.all(
      dividedAnimes.map(
        async (animes) =>
          await anilistClient.query<CharacterRequest>({
            query: gql(buildCharactersQuery(animes)),
            variables: {
              sort: "FAVOURITES_DESC",
              mediaSort: "FAVOURITES_DESC",
            },
          })
      )
    );

    const data = result
      .map(({ data }) => data)
      .map((ani) => Object.values(ani))
      .flat();

    return { data, status: 200, error: null };
  } catch (error) {
    return { data: null, status: 400, error };
  }
};

const filterCharacters = (animeData: CharacterRequestData[]) => {
  const animesWithoutNarrator = animeData.map((anime) => {
    return anime.characters.nodes.filter(
      (character) => character.name.full.toLowerCase() !== "narrator"
    );
  });

  const filteredCharacters = [];

  for (const animeCharacters of animesWithoutNarrator) {
    const sumOfFavourites = animeCharacters.reduce(
      (acc, character) => acc + character.favourites,
      0
    );

    const minFavourites = Math.floor(sumOfFavourites * 0.025);

    const validCharacters = animeCharacters.filter(
      (character) => character.favourites >= minFavourites
    );

    filteredCharacters.push(validCharacters);
  }

  return filteredCharacters.flat().map((character) => character.name.full);
};

const DATABASE_ANIMES: FranchiseList = JSON.parse(JSON.stringify(storedJson));
const BATCHES = 5;

export async function GET() {
  const animeNames = normalizeNames(parseAnimeNames(DATABASE_ANIMES));
  const dividedAnimes = divideIntoBatches(animeNames, BATCHES);

  const { data, status, error } = await fetchCharacterNames(dividedAnimes);

  if (!data) {
    return NextResponse.json({
      message: "No data returned from the API. Please try again later.",
      status,
      error,
    });
  }

  const allCharacterNames: string[] = filterCharacters(data);

  return NextResponse.json<string[]>(allCharacterNames);
}
