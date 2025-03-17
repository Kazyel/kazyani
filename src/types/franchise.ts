/**
 * Represents a franchise entity.
 * @property `string` main - The main name of the franchise.
 * @property `Set<number> | number[]` franchiseCharacters - The set of character IDs associated with the franchise.
 * @property `string[]` synonyms - Alternative names for the franchise.
 */

export type Franchise<T extends Set<number> | number[] = Set<number>> = {
  main: string;
  franchiseCharacters: T;
  synonyms: string[];
};

export type FranchiseList = Map<string, Franchise>;

export type SerializedFranchiseList = Record<string, Franchise<number[]>>;
