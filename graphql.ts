import { ky } from './deps.ts'

/**
 * GitHub GraphQL API helper. query {}` is optional and `data` is automatically unwrapped.
 *
 * ```ts
 * import { graphql } from 'https://cdn.jsdelivr.net/gh/kidonng/deno-utils/mod.ts'
 *
 * const api = graphql(GITHUB_TOKEN)
 * const {
 *   viewer: { name },
 * } = await api(`
 *   viewer {
 *     name
 *   }
 * `)
 * ```
 */
export function graphql(token: string): <T = any>(query: string) => Promise<T> {
  return async <T = any>(query: string): Promise<T> => {
    if (!query.match(/^(\s+)?query/)) query = `query {${query}}`
    const { data } = await ky
      .post('https://api.github.com/graphql', {
        json: { query },
        headers: {
          authorization: `bearer ${token}`,
        },
      })
      .json()

    return data
  }
}
