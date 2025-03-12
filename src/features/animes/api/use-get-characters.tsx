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

type Characters = {
    image: {
        large: string;
    };
    name: {
        full: string;
    };
};

const fetchAllCharacters = async (quantity: number) => {
    let allCharacters: Characters[] = [];

    for (let page = 1; page <= quantity; page++) {
        const { Page } = await request(
            "https://graphql.anilist.co",
            fetchCharacterQuery,
            {
                sort: [CharacterSort.FavouritesDesc],
                perPage: 50,
                page: page,
            }
        );

        allCharacters = (allCharacters as any[]).concat(Page!.characters!);
    }
    return allCharacters;
};

export const useGuessCharacters = (quantity: number) => {
    const {
        data: characterList,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        isInitialLoading,
    } = useQuery({
        queryKey: ["characters"],
        queryFn: () => fetchAllCharacters(quantity),
        staleTime: 1000 * 60 * 5,
    });

    console.log(characterList);

    return {
        characterList,
        isLoading,
        isFetching,
        isError,
        isSuccess,
        isInitialLoading,
    };
};
