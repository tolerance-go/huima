export type NullOrUndefinedProperties<T> = {
   [K in keyof T]: T[K] extends undefined | null ? K : never
}[keyof T]

// 如果原来对象的属性值是 undefined，那么在新对象中就不会有这个属性
// 同时如果原理对象属性包含 undefined，那么在新对象中就不会包含 undefined
export type RemoveNullOrUndefined<T> = {
   [P in keyof Omit<T, NullOrUndefinedProperties<T>>]: Exclude<
      T[P],
      undefined | null
   >
}

export function removeNullOrUndefined<T extends object>(
   obj: T,
): RemoveNullOrUndefined<T> {
   const newObj: Partial<T> = {}
   for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
         const val = obj[key]
         if (val === undefined || val === null) continue
         newObj[key] = val
      }
   }
   return newObj as RemoveNullOrUndefined<T>
}
