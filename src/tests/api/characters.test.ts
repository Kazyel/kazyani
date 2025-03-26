import { assert, expect, describe, test } from "vitest";

import { FranchiseList } from "@/lib/types";
import { AnimeRequestData, CharactersResponse } from "@/lib/types/api";
import { parseFranchiseNames } from "@/lib/scripts/write-json-franchise-names";

const ANIME_DATA = {
  shingeki_no_kyojin: {
    popularityRank: 0,
    id: 16498,
    main: "shingeki_no_kyojin",
    mainTitle: "Shingeki no Kyojin",
    englishTitle: "Attack on Titan",
    synonyms: [
      "Shingeki no Kyojin",
      "Shingeki no Kyojin Season 2",
      "Shingeki no Kyojin Season 3",
      "Shingeki no Kyojin Season 3 Part 2",
      "Shingeki no Kyojin: The Final Season",
      "Shingeki no Kyojin: The Final Season Part 2",
      "Shingeki no Kyojin: The Final Season - Kanketsu-hen",
    ],
  },
  death_note: {
    popularityRank: 1,
    id: 1535,
    main: "death_note",
    mainTitle: "Death Note",
    englishTitle: "Death Note",
    synonyms: ["Death Note"],
  },
  fullmetal_alchemist: {
    popularityRank: 2,
    id: 5114,
    main: "fullmetal_alchemist",
    mainTitle: "Fullmetal Alchemist: Brotherhood",
    englishTitle: "Fullmetal Alchemist: Brotherhood",
    synonyms: ["Fullmetal Alchemist: Brotherhood", "Fullmetal Alchemist"],
  },
  one_punch_man: {
    popularityRank: 3,
    id: 30276,
    main: "one_punch_man",
    mainTitle: "One Punch Man",
    englishTitle: "One Punch Man",
    synonyms: ["One Punch Man", "One Punch Man 2nd Season"],
  },
};

const CHARACTER_DATA = [
  {
    id: 16498,
    idMal: 16498,
    title: {
      english: "Shingeki no Kyojin",
      romaji: "Shingeki no Kyojin",
    },
    siteUrl: "https://shikimori.one/anime/shingeki-no-kyojin",
    characters: {
      nodes: [
        {
          name: {
            full: "Armin Arlert",
            native: "アルミン・アーレルト",
          },
          id: 302,
          image: {
            large:
              "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          },
          favourites: 10,
        },
        {
          name: {
            full: "Mikasa",
            native: "ミカサ",
          },
          id: 30274,
          image: {
            large:
              "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          },
          favourites: 10,
        },
      ],
    },
  },
  {
    id: 1535,
    idMal: 1535,
    title: {
      english: "Death Note",
      romaji: "Death Note",
    },
    siteUrl: "https://shikimori.one/anime/death-note",
    characters: {
      nodes: [
        {
          name: {
            full: "Lawliet",
            native: "ローリート",
          },
          id: 30275,
          image: {
            large:
              "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          },
          favourites: 10,
        },
      ],
    },
  },
  {
    id: 5114,
    idMal: 5114,
    title: {
      english: "Fullmetal Alchemist: Brotherhood",
      romaji: "Fullmetal Alchemist: Brotherhood",
    },
    siteUrl: "https://shikimori.one/anime/fullmetal-alchemist-brotherhood",
    characters: {
      nodes: [
        {
          name: {
            full: "Edward Elric",
            native: "エドワード・エルリック",
          },
          id: 30276,
          image: {
            large:
              "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          },
          favourites: 10,
        },
      ],
    },
  },
  {
    id: 16498,
    idMal: 16498,
    title: {
      english: "Shingeki no Kyojin",
      romaji: "Shingeki no Kyojin",
    },
    siteUrl: "https://shikimori.one/anime/shingeki-no-kyojin",
    characters: {
      nodes: [
        {
          name: {
            full: "Armin Arlert",
            native: "アルミン・アーレルト",
          },
          id: 302,
          image: {
            large:
              "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          },
          favourites: 10,
        },
        {
          name: {
            full: "Mikasa",
            native: "ミカサ",
          },
          id: 30274,
          image: {
            large:
              "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          },
          favourites: 10,
        },
      ],
    },
  },
];

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
  const charactersResponse: CharactersResponse = [];
  const usedCharacterIds = new Set<number>();

  for (let i = 0; i < animes.length; i++) {
    const anime = animes[i];

    const animeCharacters = anime.characters.nodes.filter(
      (character) => character.name.full.toLowerCase() !== "narrator"
    );

    let randomCharacterIndex = Math.floor(Math.random() * animeCharacters.length);
    let selectedCharacter = animeCharacters[randomCharacterIndex];

    const sumOfFavourites = animeCharacters.reduce(
      (acc, character) => acc + character.favourites,
      0
    );

    while (
      usedCharacterIds.has(selectedCharacter.id) ||
      selectedCharacter.favourites < sumOfFavourites / 6.5
    ) {
      randomCharacterIndex = Math.floor(Math.random() * animeCharacters.length);
      selectedCharacter = animeCharacters[randomCharacterIndex];
    }

    usedCharacterIds.add(selectedCharacter.id);

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

describe("Characters API tests", () => {
  test("Parse anime names", () => {
    const animeNames = parseAnimeNames(ANIME_DATA);

    expect(animeNames).toEqual([
      "Shingeki no Kyojin",
      "Death Note",
      "Fullmetal Alchemist: Brotherhood",
      "One Punch Man",
    ]);
  });

  test("Get four random animes", () => {
    const animeNames = parseAnimeNames(ANIME_DATA);
    const fourRandom = getFourRandomAnimes(animeNames);

    assert(fourRandom.length === 4, "Expected four random animes");
  });

  test("Build characters response with 2 characters from the same anime", async () => {
    const charactersResponse = await buildCharactersResponse(CHARACTER_DATA);

    expect(charactersResponse).toBeOneOf([
      [
        {
          animeRomaji: "Shingeki no Kyojin",
          animeEnglish: "Shingeki no Kyojin",
          characterId: 302,
          characterName: "Armin Arlert",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
        {
          animeRomaji: "Death Note",
          animeEnglish: "Death Note",
          characterId: 30275,
          characterName: "Lawliet",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
        {
          animeRomaji: "Fullmetal Alchemist: Brotherhood",
          animeEnglish: "Fullmetal Alchemist: Brotherhood",
          characterId: 30276,
          characterName: "Edward Elric",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
        {
          animeRomaji: "Shingeki no Kyojin",
          animeEnglish: "Shingeki no Kyojin",
          characterId: 30274,
          characterName: "Mikasa",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
      ],
      [
        {
          animeRomaji: "Shingeki no Kyojin",
          animeEnglish: "Shingeki no Kyojin",
          characterId: 30274,
          characterName: "Mikasa",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
        {
          animeRomaji: "Death Note",
          animeEnglish: "Death Note",
          characterId: 30275,
          characterName: "Lawliet",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
        {
          animeRomaji: "Fullmetal Alchemist: Brotherhood",
          animeEnglish: "Fullmetal Alchemist: Brotherhood",
          characterId: 30276,
          characterName: "Edward Elric",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
        {
          animeRomaji: "Shingeki no Kyojin",
          animeEnglish: "Shingeki no Kyojin",
          characterId: 302,
          characterName: "Armin Arlert",
          characterImage:
            "https://cdn.myanimelist.net/images/characters/11/10499.jpg?s=a8c4d6f1a5e7d7b9f9e8e9d8d7c6b5a4",
          favourites: 10,
        },
      ],
    ]);
  });

  test("Parse franchise names list", () => {
    const animesNames = parseFranchiseNames(ANIME_DATA);

    expect(animesNames).toEqual([
      "Shingeki no Kyojin",
      "Attack on Titan",
      "Death Note",
      "Fullmetal Alchemist: Brotherhood",
      "One Punch Man",
    ]);
  });
});
