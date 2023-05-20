import { CSSStyle } from '../type'

export function generateBorderCSS(
   node: Pick<
      FrameNode,
      | 'strokes'
      | 'strokes'
      | 'strokeWeight'
      | 'strokeStyleId'
      | 'cornerRadius'
      | 'dashPattern'
   >,
): CSSStyle {
   let cssProps: CSSStyle = {
      'border-radius': String(node.cornerRadius) + 'px',
   }

   if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0]
      if (stroke.type === 'SOLID') {
         cssProps['border-color'] = stroke.color
            ? `rgba(${Math.round(stroke.color.r * 255)}, ${Math.round(
                 stroke.color.g * 255,
              )}, ${Math.round(stroke.color.b * 255)}, ${stroke.opacity})`
            : ''

         if (node.dashPattern && node.dashPattern.length > 0) {
            cssProps['border-style'] = 'dashed'
         } else {
            cssProps['border-style'] = 'solid'
         }

         cssProps['border-width'] = node.strokeWeight
            ? `${String(node.strokeWeight)}px`
            : ''
      }
   }

   return cssProps
}
