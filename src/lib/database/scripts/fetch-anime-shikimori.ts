import type {
  AnimeShikimoriEntry,
  ShikimoriRequest,
} from "@/lib/database/models/shikimori-requests";

import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { normalizeFranchise } from "@/lib/utils/api";
import { writeJSONAnimeData } from "@/lib/database/scripts/json/write-json-anime-data";

export const shikimoriClient = new ApolloClient({
  uri: "https://shikimori.one/api/graphql",
  cache: new InMemoryCache({ addTypename: false }),
});

const buildAnimesQuery = (pageCount: number, pageOffset: number) => {
  const pages = [...Array(pageCount)].map((_, i) => {
    const pageNumber = i + 1 + pageOffset;

    return `
      page${pageNumber}: animes(page: ${pageNumber}, limit: 50, order: popularity) {
        malId
        name
        english
        franchise
        score
        studios {
          name
        }
        genres {
          name
          kind
        }
        airedOn {
          year
        }
      }
    `;
  });

  return `query { ${pages.join("\n")} }`;
};

const fetchAnimesData = async (pageCount: number, pageOffset: number) => {
  try {
    const { data } = await shikimoriClient.query<ShikimoriRequest>({
      query: gql(buildAnimesQuery(pageCount, pageOffset)),
      context: {
        uri: "https://shikimori.one/api/graphql",
      },
    });

    return Object.values(data).flat();
  } catch (error) {
    console.error("Failed to fetch anime data from the API:", error);
    return null;
  }
};

export const addToFranchiseList = (
  anime: AnimeShikimoriEntry,
  franchiseList: ShikimoriRequest,
  franchise: string
) => {
  const franchiseEntry = franchiseList[franchise] ?? {
    malId: anime.malId,
    franchise: franchise,
    jp_title: anime.name,
    en_title: anime.english,
    score: anime.score,
    synonyms: JSON.stringify({}),
    studios: JSON.stringify(anime.studios),
    genres: JSON.stringify(anime.genres),
    airedOn: anime.airedOn.year,
  };

  franchiseList[franchise] = franchiseEntry;
};

export const buildFranchiseList = (animes: AnimeShikimoriEntry[]) => {
  return animes.reduce((acc, anime) => {
    const franchiseName = anime.franchise ? anime.franchise : normalizeFranchise(anime.name);

    addToFranchiseList(anime, acc, franchiseName);

    return acc;
  }, {});
};

const animes = await fetchAnimesData(10, 0);

const franchiseList = buildFranchiseList(animes!);

writeJSONAnimeData(franchiseList, "./data/shikimori-request.json");
