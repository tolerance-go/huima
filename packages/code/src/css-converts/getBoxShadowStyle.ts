import { CSSStyle } from '../type'

export function getBoxShadowStyle(effectNodes: readonly Effect[]): CSSStyle {
   let boxShadowValues: string[] = []

   for (let effectNode of effectNodes) {
      if (effectNode.visible && effectNode.type === 'DROP_SHADOW') {
         boxShadowValues.push(
            `${effectNode.offset.x}px ${effectNode.offset.y}px ${
               effectNode.radius
            }px rgba(${Math.round(effectNode.color.r * 255)}, ${Math.round(
               effectNode.color.g * 255,
            )}, ${Math.round(effectNode.color.b * 255)}, ${
               effectNode.color.a
            })`,
         )
         break
      }
   }

   if (boxShadowValues.length === 0) {
      return {}
   }

   let css: CSSStyle = {
      'box-shadow': boxShadowValues.join(', '),
   }

   return css
}
