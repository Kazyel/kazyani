import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

export type Characters = {
  nodes: Character[];
};

export type Character = {
  id: number;
  image: {
    large: string;
  };
  name: {
    full: string;
  };
  favourites: number;
};

export type Media = {
  title: {
    english: string;
    romaji: string;
  };
  characters: Characters;
};

type PageData = {
  [key: string]: {
    media: Media[];
  };
};

const generateBatchQuery = (quantity: number) => {
  let query = `
        query MediaList($sort: [MediaSort], $mediaPerPage: Int, $perPage: Int, $charactersSort: [CharacterSort]) {    
      `;

  for (let page = 1; page <= quantity; page++) {
    query += `
              page${page}: Page (perPage: $mediaPerPage, page: ${page}) {
                 media(sort: $sort) {
                    title {
                      english
                      romaji
                    }
                   characters(perPage: $perPage, sort: $charactersSort) {
                      nodes {
                      id
                        image {
                          large
                        }
                        name {
                          full
                        }
                        favourites
                      }
                    }
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
    mediaPerPage: 40,
    perPage: 10,
    sort: "POPULARITY_DESC",
    charactersSort: "FAVOURITES_DESC",
  };

  const pages: PageData = await request("https://graphql.anilist.co", query, variables);

  let allMedia: Media[] = [];

  for (let page = 1; page <= quantity; page++) {
    const pageData = pages[`page${page}`];

    if (pageData && pageData.media) {
      allMedia = allMedia.concat(pageData.media);
    }
  }

  return allMedia;
};

export const useGetCharacters = (quantity: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["animes", quantity],
    queryFn: () => fetchAllCharacters(quantity),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    data,
    isLoading,
  };
};
