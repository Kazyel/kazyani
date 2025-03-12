import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://graphql.anilist.co",
    documents: ["./src/**/*.{ts,tsx}"],
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        "./src/gql/": {
            preset: "client",
        },
    },
};

export default config;
