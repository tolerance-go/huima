import { NonFunctionProperties } from '@huima/types'

export function filterObjFuncAndSymbol<T>(obj: T): NonFunctionProperties<T> {
   const result: Partial<NonFunctionProperties<T>> = {}

   for (const key in obj) {
      if (typeof obj[key] !== 'function' && typeof obj[key] !== 'symbol') {
         ;(result as Record<string, any>)[key] = obj[key]
      }
   }

   return result as NonFunctionProperties<T>
}
