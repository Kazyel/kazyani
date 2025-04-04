export type AnimeDatabaseEntry = {
  malId: number;
  en_title: string;
  jp_title: string;
  genres: string;
  studios: string;
  images: string;
  franchise_entries: string;
  franchise: string;
  opening_links: string;
  score: number;
  airedOn: number;
  source: string;
  difficulty: string;
};

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export enum Source {
  Visual_Novel = "Visual Novel",
  Manga = "Manga",
  Original = "Original",
  Light_Novel = "Light Novel",
  Novel = "Novel",
  Video_Game = "Video Game",
  Koma = "4-Koma Manga",
}

export type AnimeDatabaseSerializedEntry = {
  malId: number;
  en_title: string;
  jp_title: string;
  genres: {
    name: string;
    kind: string;
  }[];
  studios: {
    name: string;
  }[];
  images: string;
  franchise_entries: string[];
  franchise: string;
  opening_links: string;
  score: number;
  airedOn: number;
  source: Source;
  difficulty: Difficulty;
};
