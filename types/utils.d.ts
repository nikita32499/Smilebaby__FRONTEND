declare global {
  type Pretty<T> = T extends object
    ? {
      [K in keyof T]: T[K] extends object ? Pretty<T[K]> : T[K]
    }
    : T extends Array<infer Element>
    ? Pretty<Element>[]
    : T

  type Mutable<T> = {
    -readonly [P in keyof T]: T[P] extends Array<infer U>
    ? Array<Mutable<U>>
    : T[P] extends object
    ? Mutable<T[P]>
    : T[P]
  }

  type Nullable<T> = T extends object
    ? {
      [K in keyof T]: T[K] | null
    }
    : T | null

  type DeepReadonly<T> = T extends object
    ? {
      readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
    }
    : T extends Array<infer Element>
    ? ReadonlyArray<Element>[]
    : readonly T
}

export { }
