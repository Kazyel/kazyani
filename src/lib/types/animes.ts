/**
 * Represents a Anime Media entity.
 * @property `number` id - The ID of the Anime Media.
 * @property `number` idMal - The ID of the Anime Media on MyAnimeList.
 * @property `string` title.english - The English title of the Anime Media.
 * @property `string` title.romaji - The Romaji title of the Anime Media.
 * @property `string` siteUrl - The URL of the Anime Media's AniList website.
 * @property `Character[]` characters - The characters associated with the Anime Media.
 */

export type AnimeMediaData = {
  id: number;
  idMal: number;
  title: {
    english: string;
    romaji: string;
  };
  siteUrl: string;
  characters: {
    name: {
      full: string;
    };
  }[];
};

/**
 * Represents a franchise entity.
 * @property `string` main - The main name of the franchise.
 * @property `Set<number> | number[]` franchiseCharacters - The set of character IDs associated with the franchise.
 * @property `string[]` synonyms - Alternative names for the franchise.
 */

export type Franchise = {
  popularityRank: number;
  id: number;
  main: string;
  mainTitle: string;
  englishTitle: string;
  synonyms: string[];
  studios: {
    name: string;
  };
  genres: {
    name: string;
    kind: string;
  };
  airedOn: {
    year: number;
  };
};

export type FranchiseList = {
  [key: string]: Franchise;
};
