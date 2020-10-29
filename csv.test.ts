import { TableToCSV, ObjectToCSV, CSVToTable } from './csv.ts'
import { assertEquals } from 'https://deno.land/std@0.75.0/testing/asserts.ts'

const fixtures = 'fixtures/csv'
const test1 = 'TableToCSV'
const test2 = 'ObjectToCSV'
const test3 = 'CSVToTable'

Deno.test(test1, () => {
  const input = Deno.readTextFileSync(`${fixtures}/${test1}/input.json`)
  const output = Deno.readTextFileSync(`${fixtures}/${test1}/output.csv`)

  assertEquals(TableToCSV(JSON.parse(input)), output)
})

Deno.test(test2, () => {
  const input = Deno.readTextFileSync(`${fixtures}/${test2}/input1.json`)
  const output = Deno.readTextFileSync(`${fixtures}/${test2}/output1.csv`)

  assertEquals(ObjectToCSV(JSON.parse(input)), output)
})

Deno.test(`${test2} (with options)`, () => {
  const input = Deno.readTextFileSync(`${fixtures}/${test2}/input2.json`)
  const output = Deno.readTextFileSync(`${fixtures}/${test2}/output2.csv`)

  assertEquals(
    ObjectToCSV(JSON.parse(input), {
      colSeparator: '|',
      keys: ['a', 'b'],
    }),
    output
  )
})

for (const { name: _name } of Deno.readDirSync(`${fixtures}/input`)) {
  const name = _name.split('.')[0]

  Deno.test(`${test3} (${name})`, () => {
    const input = Deno.readTextFileSync(`${fixtures}/input/${name}.csv`)
    const output = Deno.readTextFileSync(`${fixtures}/output/${name}.json`)

    const options = name.endsWith('_crlf') ? { rowSeparator: '\r\n' } : {}
    const parsed = CSVToTable(input, options)
    const converted = parsed
      .slice(1)
      .map((row) =>
        Object.fromEntries(parsed[0].map((key, i) => [key, row[i]]))
      )

    assertEquals(converted, JSON.parse(output))
  })
}
