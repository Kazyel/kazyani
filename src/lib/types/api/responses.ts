import type { FranchiseList } from "../animes";

export type FranchisesResponse = {
  franchiseList: FranchiseList;
};

export type CharacterInfo = {
  animeName: string;
  characterId: number;
  characterName: string;
  characterImage: string;
  favourites: number;
};

export type CharactersResponse = Record<string, CharacterInfo>;
