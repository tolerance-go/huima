import { findSolidPaint } from '../utils/findSolidPaint'
import { getFillSolidColor } from '../utils/getFillSolidColor'

export const getBackgroundColorStyle = (fills: readonly Paint[] | symbol) => {
   const solidPaint = findSolidPaint(fills)

   if (solidPaint) {
      return {
         'background-color': getFillSolidColor(solidPaint),
      }
   }

   return undefined
}
