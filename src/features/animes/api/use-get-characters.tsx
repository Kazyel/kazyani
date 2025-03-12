import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const fetchAnimeQueryDocument = graphql(
    `
        query fetchAnimeQuery($search: String) {
            Media(type: ANIME, search: $search) {
                id
                title {
                    romaji
                    english
                    native
                }
                meanScore
                popularity
                description
                characters(sort: FAVOURITES_DESC) {
                    nodes {
                        name {
                            full
                            native
                            alternative
                        }
                        image {
                            large
                            medium
                        }
                    }
                }
            }
        }
    `
);

export const useGuessCharacters = (anime: string) => {
    const { data, isLoading, isError } = useQuery(["anime", anime], async () =>
        request("https://graphql.anilist.co", fetchAnimeQueryDocument, {
            search: anime,
        })
    );

    return { data, isLoading, isError };
};
