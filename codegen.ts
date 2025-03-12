import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "https://graphql.anilist.co",
    documents: ["./src/**/*.{ts,tsx}"],
    ignoreNoDocuments: false, // for better experience with the watcher
    generates: {
        "./src/gql/": {
            preset: "client",
        },
    },
};

export default config;
