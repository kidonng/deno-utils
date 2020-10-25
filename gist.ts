import { ky } from './deps.ts'

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

export function gist(token: string) {
  const api = ky.extend({
    prefixUrl: 'https://api.github.com/',
    headers: {
      authorization: `token ${token}`,
    },
  })

  const getGist = (id: string): Promise<Gist> => api.get(`gists/${id}`).json()
  const updateGist = ({ id, description, files }: UpdateGistOptions) =>
    api
      .patch(`gists/${id}`, {
        json: { description, files },
      })
      .json()

  return { getGist, updateGist }
}
