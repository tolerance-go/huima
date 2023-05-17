import { getFillSolidColor } from '../utils/getFillSolidColor'

export const getBackgroundColorCSS = (fills: readonly Paint[] | symbol) => {
   return {
      'background-color': getFillSolidColor(fills),
   }
}
