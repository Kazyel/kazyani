import { AnimeMediaData } from "../animes";

export type AnimeRequestData = Omit<AnimeMediaData, "characters"> & {
  characters: {
    nodes: {
      id: number;
      image: {
        large: string;
      };
      name: {
        native: string;
        full: string;
      };
      favourites: number;
    }[];
  };
};

export type AnimeRequest = AnimeRequestData[];

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
