import type { FranchiseList } from "../animes";
import { CharacterRequestData } from "./requests";

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
} | null;

export type CharactersResponse = CharacterInfo[];
