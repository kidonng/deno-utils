interface BaseOperation {
  key: PropertyKey
}

export interface GetOperation extends BaseOperation {
  type: 'get'
  value: unknown
}

export interface SetOperation extends BaseOperation {
  type: 'set'
  value: unknown
  newValue: unknown
}

export interface DeleteOperation extends BaseOperation {
  type: 'delete'
}

export type Operation = GetOperation | SetOperation | DeleteOperation
export type Subscriber = (operation: Operation) => void
export type Subscribers = Map<unknown, Set<Subscriber>>

export const subscribeAll = Symbol()

export function proxy<T extends Object>(
  source: T,
  subscribers: Subscribers
): T {
  return new Proxy<T>(source, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)

      for (const source of [
        subscribers.get(subscribeAll),
        subscribers.get(key),
      ]) {
        if (source)
          for (const subscriber of source) {
            subscriber({
              type: 'get',
              key,
              value,
            })
          }
      }

      if (typeof value === 'object') return proxy(value, subscribers)
      return value
    },
    set(target, key, newValue, receiver) {
      const value = Reflect.get(target, key, receiver)
      const status = Reflect.set(target, key, newValue, receiver)

      if (status)
        for (const source of [
          subscribers.get(subscribeAll),
          subscribers.get(key),
        ]) {
          if (source)
            for (const subscriber of source) {
              subscriber({
                type: 'set',
                key,
                value,
                newValue,
              })
            }
        }

      return newValue
    },
    deleteProperty(target, key) {
      const status = Reflect.deleteProperty(target, key)

      if (status)
        for (const source of [
          subscribers.get(subscribeAll),
          subscribers.get(key),
        ]) {
          if (source)
            for (const subscriber of source) {
              subscriber({
                type: 'delete',
                key,
              })
            }
        }

      return status
    },
  })
}

export class SubProxy<T extends Object> {
  data: T
  #subscribers: Subscribers = new Map()

  constructor(source: T) {
    this.data = proxy(source, this.#subscribers)
  }

  subscribe = (key: PropertyKey, subscriber: Subscriber): void => {
    if (!this.#subscribers.has(key)) this.#subscribers.set(key, new Set())
    this.#subscribers.get(key)!.add(subscriber)
  }

  unsubscribe = (key?: PropertyKey, subscriber?: Subscriber): void => {
    if (!key) {
      this.#subscribers = new Map()
      return
    }

    if (!subscriber) {
      this.#subscribers.delete(key)
      return
    }

    this.#subscribers.get(key)?.delete(subscriber)
  }
}
