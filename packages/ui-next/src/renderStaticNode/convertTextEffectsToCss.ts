import { rgbaToHex } from './rgbaToHex'

// 只处理了 DROP_SHADOW 和 INNER_SHADOW，其他的暂时不处理，并且只处理了第一个
export function convertTextEffectsToCss(effects: readonly Effect[]): string {
   let cssEffects: string = ''

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
         cssEffects = `text-shadow: ${shadow};`
      } else if (effect.type === 'INNER_SHADOW') {
         let shadow = `inset ${effect.offset.x}px ${effect.offset.y}px ${
            effect.radius
         }px ${rgbaToHex(
            effect.color.r,
            effect.color.g,
            effect.color.b,
            effect.color.a,
         )}`
         cssEffects = `text-shadow: ${shadow};`
      }
   }

   return cssEffects
}
