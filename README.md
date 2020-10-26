# Deno Utils

## [Gist](gist.ts)

Getting and updating GitHub gists.

```ts
import { gist } from 'https://cdn.jsdelivr.net/gh/kidonng/deno-utils/mod.ts'

const { getGist } = gist(GITHUB_TOKEN)
const { files } = await getGist('12345678')
```

## [GraphQL](graphql.ts)

GitHUb GraphQL API wrapper.

```ts
import { graphql } from 'https://cdn.jsdelivr.net/gh/kidonng/deno-utils/mod.ts'

const api = graphql(GITHUB_TOKEN)
const {
  viewer: { name },
} = await api(`
  viewer {
    name
  }
`)
```
