import { FranchiseList } from "@/lib/types";

export const normalizeNames = (animeNames: string[]) => {
  const normalizedAnimeNames = animeNames.map((anime) =>
    anime
      .toLowerCase()
      .replace(/\s/g, "_")
      .replace(/[★\W-]/g, "")
  );

  return normalizedAnimeNames;
};

export const normalizeFranchise = (franchise: string) => {
  return franchise.replace(/\s/g, "_").toLowerCase();
};

export const parseAnimeNames = (animes: FranchiseList) => {
  const animesData: string[] = [];

  for (const [_, data] of Object.entries(animes)) {
    animesData.push(data.mainTitle);
  }

  return animesData;
};

export const divideIntoBatches = (data: string[], batches: number) => {
  const batchSize = Math.ceil(data.length / batches);

  const divided: string[][] = [];

  for (let i = 0; i < batches; i++) {
    divided.push(data.slice(i * batchSize, (i + 1) * batchSize));
  }

  return divided;
};
