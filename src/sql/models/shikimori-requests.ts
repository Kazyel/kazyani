export type AnimeShikimoriEntry = {
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

export type ShikimoriRequest = Record<string, AnimeShikimoriEntry>;
