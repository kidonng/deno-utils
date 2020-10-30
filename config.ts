import { dirname, ensureDirSync, existsSync } from './deps.ts'
import { SubProxy, subscribeAll } from './proxy.ts'
import { parseJSON } from './json.ts'

export class Config<T extends Object> extends SubProxy<T> {
  path: string

  constructor(path: string, autoSave: boolean = true) {
    super(
      (existsSync(path)
        ? parseJSON(Deno.readTextFileSync(path), () => Deno.removeSync(path))
        : {}) as T
    )
    this.path = path

    if (autoSave)
      this.subscribe(subscribeAll, ({ type, value, newValue }) => {
        switch (type) {
          case 'set':
            if (Object.is(value, newValue)) break
          case 'delete':
            this.save()
        }
      })
  }

  save = () => {
    ensureDirSync(dirname(this.path))
    Deno.writeTextFileSync(this.path, JSON.stringify(this.data))
  }

  reset = () => {
    this.data = {} as T
    this.save()
  }
}
