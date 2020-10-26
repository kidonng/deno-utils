import { ky } from './deps.ts'

/**
 * GitHub GraphQL API helper. query {}` is optional and `data` is automatically unwrapped.
 *
 * ```ts
 * import { GraphQL } from 'https://cdn.jsdelivr.net/gh/kidonng/deno-utils/mod.ts'
 *
 * const { graphql } = new GraphQL(token)
 * const {
 *   viewer: { name },
 * } = await graphql(`
 *   viewer {
 *     name
 *   }
 * `)
 * ```
 */
export class GraphQL {
  #api: typeof ky

  constructor(token: string) {
    this.#api = ky.extend({
      prefixUrl: 'https://api.github.com/',
      headers: {
        authorization: `token ${token}`,
      },
    })
  }

  graphql = async <T = any>(query: string): Promise<T> => {
    if (!query.match(/^(\s+)?query/)) query = `query {${query}}`
    const { data } = await this.#api
      .post('graphql', {
        json: { query },
      })
      .json()

    return data
  }
}
