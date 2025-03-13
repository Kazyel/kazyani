import { CharacterSort } from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

export type Characters = {
  image: {
    large: string;
  };
  name: {
    full: string;
  };
};

type PageData = {
  [key: string]: {
    characters: Characters[];
  };
};

const characterFields = `
    image {
        large
    }
    name {
        full
    }
`;

const generateBatchQuery = (quantity: number) => {
  let query = `
        query fetchCharacterQuery(
            $sort: [CharacterSort]
            $perPage: Int
        ) {
    `;

  for (let page = 1; page <= quantity; page++) {
    query += `
            page${page}: Page(perPage: $perPage, page: ${page}) {
                characters(sort: $sort) {
                    ${characterFields}
                }
            }
        `;
  }

  query += `
        }
    `;

  return query;
};

const fetchAllCharacters = async (quantity: number) => {
  const query = generateBatchQuery(quantity);

  const variables = {
    sort: [CharacterSort.FavouritesDesc],
    perPage: 48,
  };

  const pages: PageData = await request("https://graphql.anilist.co", query, variables);

  let allCharacters: Characters[] = [];

  for (let page = 1; page <= quantity; page++) {
    const pageData = pages[`page${page}`];

    if (pageData && pageData.characters) {
      allCharacters = allCharacters.concat(pageData.characters);
    }
  }

  return allCharacters;
};

export const useGetCharacters = (quantity: number) => {
  const { data: characterList, isLoading } = useQuery({
    queryKey: ["characters", quantity],
    queryFn: () => fetchAllCharacters(quantity),
    staleTime: 1000 * 60 * 5,
  });

  return {
    characterList,
    isLoading,
  };
};
