export type AnimeRequestData = {
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

export type AnimeRequest = Record<string, AnimeRequestData[]>;
