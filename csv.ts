export interface CSVOptions {
  rowSeparator?: string
  colSeparator?: string
}

/** Convert table (array of array of string) to CSV. */
export function TableToCSV(rows: string[][], options: CSVOptions = {}): string {
  const { rowSeparator = '\n', colSeparator = ',' } = options
  return rows.map((cols) => cols.join(colSeparator)).join(rowSeparator)
}

export interface ObjectToCSVOptions extends CSVOptions {
  keys?: string[]
}

/** Convert object array to CSV. */
export function ObjectToCSV(
  rows: Record<string, string>[],
  options: ObjectToCSVOptions = {}
): string {
  const {
    rowSeparator = '\n',
    colSeparator = ',',
    keys = Object.keys(rows[0]),
  } = options

  const converted = rows.map((row) =>
    keys.map((key) => row[key]).join(colSeparator)
  )

  return [keys.join(colSeparator), ...converted].join(rowSeparator)
}

/** Convert CSV to table (array of array of string). */
export function CSVToTable(
  source: string,
  options: CSVOptions = {}
): string[][] {
  const rows: string[][] = [[]]
  let index = 0
  let field = ''
  let quote = false

  const { rowSeparator = '\n', colSeparator = ',' } = options
  const pushField = () => {
    rows[rows.length - 1].push(field)
    field = ''
  }
  const pushToken = (token: string) => {
    field += token
    if (index === source.length - 1) pushField()
  }

  while (index < source.length) {
    const token = source[index]

    switch (true) {
      case token === colSeparator:
        if (quote) pushToken(token)
        else pushField()
        break
      case rowSeparator.includes(token):
        if (quote) pushToken(token)
        else {
          if (token === rowSeparator[rowSeparator.length - 1]) {
            pushField()
            if (index !== source.length - 1) rows.push([])
          }
        }
        break
      case token === '"':
        if (quote) {
          if (source[index + 1] === '"') {
            pushToken(token)
            index++
          } else quote = false
        } else quote = true
        break
      default:
        pushToken(token)
    }

    index++
  }

  return rows
}
