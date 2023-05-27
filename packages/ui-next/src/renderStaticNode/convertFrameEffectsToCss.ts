import { rgbaToHex } from './rgbaToHex'

/**
 * 1. 返回一个对象，包含了所有的 css 属性
 * @param effects
 * @returns
 */
export function convertFrameEffectsToCss(effects: readonly Effect[]) {
   let cssEffects: Record<string, string> = {}

   const supports = effects.filter(
      (effect) =>
         effect.visible &&
         (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW'),
   )

   if (supports.length) {
      const effect = supports[0]
      if (effect.type === 'DROP_SHADOW') {
         let shadow = `${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects['box-shadow'] = shadow
      } else if (effect.type === 'INNER_SHADOW') {
         let shadow = `inset ${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects['box-shadow'] = shadow
      }
   }

   return cssEffects
}
