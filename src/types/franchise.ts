/**
 * Represents a franchise entity.
 * @property `string` main - The main name of the franchise.
 * @property `Set<number> | number[]` franchiseCharacters - The set of character IDs associated with the franchise.
 * @property `string[]` synonyms - Alternative names for the franchise.
 */

export type Franchise<T = Set<number> | number[]> = {
  popularityRank: number;
  id: number;
  main: string;
  mainTitle: string;
  franchiseCharacters: T;
  synonyms: string[];
};

export type InMemoryFranchise = Franchise<Set<number>>;
export type FranchiseList = Map<string, InMemoryFranchise>;
export type SerializedFranchiseList = Record<string, Franchise<number[]>>;
