import type { FranchiseList } from "../animes";

export type FranchisesResponse = {
  franchiseList: FranchiseList;
};

export type CharacterInfo = {
  animeRomaji: string;
  animeEnglish: string;
  characterId: number;
  characterName: string;
  characterImage: string;
  favourites: number;
};

export type CharactersResponse = Record<string, CharacterInfo>;
