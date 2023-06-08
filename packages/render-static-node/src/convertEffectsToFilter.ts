import { rgbaToHex } from './rgbaToHex'

export function convertEffectsToFilter(
   effects: readonly Effect[],
): Record<string, string | null> {
   let cssFilter = null
   const dropShadowEffect = effects.find(
      (effect) => effect.type === 'DROP_SHADOW' && effect.visible !== false,
   ) as DropShadowEffect | undefined

   if (dropShadowEffect) {
      const { offset, radius, color } = dropShadowEffect
      cssFilter = `drop-shadow(${offset.x}px ${
         offset.y
      }px ${radius}px ${rgbaToHex(color.r, color.g, color.b, color.a)})`
   }

   return {
      filter: cssFilter,
   }
}
