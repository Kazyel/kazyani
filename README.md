# Kazyani

This is a project completly inspired by [AniGuessr](https://aniguessr.com/).

The whole idea is to create small and silly minigames based on animes. Guess the hidden anime, the characters names and where the opening is from.

## Technical Stuff

The project is being crafted (for now, might get more things) with [Next.js](https://nextjs.org/), [ShadCN](https://ui.shadcn.com/) and [ReactQuery](https://tanstack.com/query/v4/).

The project is still in its early stages, so expect some bugs and rough edges.

All data consumed is provided by [AniList](https://docs.anilist.co/) and [AnimeThemes](https://api-docs.animethemes.moe/) APIs.

## Running the project

```bash
# Clone the repository
git clone https://github.com/kazyel/kazyani.git

cd kazyani

# Install dependencies
bun install
bun run dev

# To generate the GraphQL types on the fly
bun run codegen
bun run graphql-codegen --watch
```

## Contributing

Contributions are super welcome!
