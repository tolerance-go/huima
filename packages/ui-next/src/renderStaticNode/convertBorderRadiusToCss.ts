import { CornerRadiusType } from '@huima/types-next'

export const convertBorderRadiusToCss = (cornerRadius: CornerRadiusType) => {
   if (typeof cornerRadius === 'number') {
      return {
         'border-radius': `${cornerRadius}px`,
      }
   }
   return {
      'border-radius': `${cornerRadius.topLeftRadius}px ${cornerRadius.topRightRadius}px ${cornerRadius.bottomRightRadius}px ${cornerRadius.bottomLeftRadius}px`,
   }
}
