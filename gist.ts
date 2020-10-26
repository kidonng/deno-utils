import { ky } from './deps.ts'

// TODO: incomplete type
export interface Gist {
  files: Record<string, GistFile>
  [key: string]: any
}

export interface GistFile {
  filename: string
  type: string
  language: string
  raw_url: string
  size: number
  truncated: boolean
  content: string
}

export interface UpdateGistOptions {
  id: string
  description?: string
  files?: Record<string, Pick<GistFile, 'filename' | 'content'>>
}

/**
 * Getting and updating GitHub gists.
 *
 * ```ts
 * import { GistAPI } from 'https://cdn.jsdelivr.net/gh/kidonng/deno-utils/mod.ts'
 *
 * const { get } = new GistAPI(token)
 * const { files } = await get('12345678')
 * ```
 */
export class GistAPI {
  #api: typeof ky

  constructor(token: string) {
    this.#api = ky.extend({
      prefixUrl: 'https://api.github.com/',
      headers: {
        authorization: `token ${token}`,
      },
    })
  }

  get = (id: string): Promise<Gist> => this.#api.get(`gists/${id}`).json()

  update = ({ id, description, files }: UpdateGistOptions): Promise<any> =>
    this.#api
      .patch(`gists/${id}`, {
        json: { description, files },
      })
      .json()
}
