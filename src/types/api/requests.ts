import { AnimeMediaData } from "../animes";

export type AnimeRequestData = Omit<AnimeMediaData, "characters"> & {
  characters: {
    nodes: {
      name: {
        full: string;
      };
    }[];
  };
};

export type FranchiseRequestData = {
  id: number;
  malId: number;
  name: string;
  franchise: string;
  characterRoles: {
    character: {
      id: number;
    };
  }[];
};

export type FranchiseRequest = Record<string, FranchiseRequestData[]>;
