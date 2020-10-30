export function parseJSON(json: string, callback?: Function): unknown {
  try {
    return JSON.parse(json)
  } catch {
    if (callback) callback()
    return {}
  }
}
