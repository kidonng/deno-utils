import { dirname, ensureDirSync, existsSync } from './deps.ts'
import { SubProxy, subscribeAll } from './proxy.ts'
import { parseJSON } from './json.ts'

export class Config<T extends Object> extends SubProxy<T> {
  path: string
  #dir: string

  constructor(path: string, autoSave: boolean = true) {
    super(
      parseJSON(existsSync(path) ? Deno.readTextFileSync(path) : '{}', () => {
        Deno.removeSync(path)
        return {}
      }) as T
    )
    this.path = path
    this.#dir = dirname(path)

    if (autoSave)
      this.subscribe(subscribeAll, (operation) => {
        switch (operation.type) {
          case 'set':
            if (Object.is(operation.value, operation.newValue)) break
          case 'delete':
            this.save()
        }
      })
  }

  save = () => {
    ensureDirSync(this.#dir)
    Deno.writeTextFileSync(this.path, JSON.stringify(this.data))
  }
}
