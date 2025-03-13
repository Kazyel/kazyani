import { graphql } from "@/gql";
import { CharacterSort } from "@/gql/graphql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const fetchCharacterQuery = graphql(`
    query fetchCharacterQuery(
        $sort: [CharacterSort]
        $perPage: Int
        $page: Int
    ) {
        Page(perPage: $perPage, page: $page) {
            characters(sort: $sort) {
                image {
                    large
                }
                name {
                    full
                }
            }
        }
    }
`);

export type Characters = {
    image: {
        large: string;
    };
    name: {
        full: string;
    };
};

const fetchAllCharacters = async (quantity: number) => {
    const fetchPage = async (page: number) => {
        const { Page } = await request(
            "https://graphql.anilist.co",
            fetchCharacterQuery,
            {
                sort: [CharacterSort.FavouritesDesc],
                perPage: 48,
                page: page,
            }
        );
        return Page!.characters!;
    };

    const pagePromises = [];

    for (let page = 1; page <= quantity; page++) {
        pagePromises.push(fetchPage(page));
    }

    const pages = (await Promise.all(pagePromises)).flat();
    return pages as Characters[];
};

export const useGetCharacters = (quantity: number) => {
    const {
        data: characterList,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        isInitialLoading,
        status,
    } = useQuery({
        queryKey: ["characters", quantity],
        queryFn: () => fetchAllCharacters(quantity),
        staleTime: 1000 * 60 * 5,
    });

    return {
        characterList,
        isLoading,
        isFetching,
        isError,
        isSuccess,
        isInitialLoading,
        status,
    };
};
