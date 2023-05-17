export function removeUndefined<T extends Object>(obj: T): T {
   for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === undefined) {
         delete obj[key]
      }
   }
   return obj
}
