export function parseJSON(json: string, fallback?: Function): unknown {
  try {
    return JSON.parse(json)
  } catch {
    return fallback ? fallback() : {}
  }
}
