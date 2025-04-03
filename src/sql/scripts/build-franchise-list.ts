import { FranchiseList } from "@/lib/types";
import { FranchiseRequest, FranchiseRequestData } from "@/lib/types/api";
import { normalizeFranchise } from "@/utils/api";
import { writeJSONAnimeData } from "@/sql/scripts/write-json-anime-data";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

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
    const { data } = await shikimoriClient.query<FranchiseRequest>({
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
  anime: FranchiseRequestData,
  franchiseList: FranchiseList,
  franchise: string,
  popularityRank: number
) => {
  const franchiseEntry = franchiseList[franchise] ?? {
    popularityRank,
    id: anime.malId,
    main: franchise,
    mainTitle: anime.name,
    englishTitle: anime.english,
    synonyms: [],
    studios: anime.studios,
    genres: anime.genres,
    airedOn: anime.airedOn.year,
  };

  franchiseEntry.synonyms.push(anime.name);
  franchiseList[franchise] = franchiseEntry;
};

export const buildFranchiseList = (animes: FranchiseRequestData[]) => {
  return animes.reduce((acc, anime, popularityRank) => {
    const franchiseName = anime.franchise ? anime.franchise : normalizeFranchise(anime.name);

    addToFranchiseList(anime, acc, franchiseName, popularityRank);

    return acc;
  }, {});
};

const animes = await fetchAnimesData(10, 0);

const franchiseList = buildFranchiseList(animes!);

writeJSONAnimeData(franchiseList, "./src/sql/data/franchiseList.json");
