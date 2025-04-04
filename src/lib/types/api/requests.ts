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
  english: string | null;
  franchise: string;
  score: number;
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

export type FranchiseRequest = Record<string, FranchiseRequestData[]>;

export type CharacterRequestData = {
  characters: {
    nodes: {
      name: {
        native: string;
        full: string;
      };
      favourites: number;
    }[];
  };
};

export type CharacterRequest = CharacterRequestData[];
