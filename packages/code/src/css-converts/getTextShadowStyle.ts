import { CSSStyle } from '../type'

export function getTextShadowStyle(effectNodes: readonly Effect[]): CSSStyle {
   let textShadowValues: string[] = []

   for (let effectNode of effectNodes) {
      if (effectNode.visible && effectNode.type === 'DROP_SHADOW') {
         textShadowValues.push(
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

   if (textShadowValues.length === 0) {
      return {}
   }

   let css: CSSStyle = {
      'text-shadow': textShadowValues.join(', '),
   }

   return css
}
