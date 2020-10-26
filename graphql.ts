import { ky } from './deps.ts'

export function graphql(token: string) {
  const api = async (query: string) => {
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

  return api
}
