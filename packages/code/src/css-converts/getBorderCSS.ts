import { CSSStyle } from '../type'

export function generateBorderCSS(
   node: Pick<
      FrameNode,
      'strokes' | 'strokes' | 'strokeWeight' | 'strokeStyleId' | 'cornerRadius'
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
      }
      cssProps['border-width'] = node.strokeWeight
         ? `${String(node.strokeWeight)}px`
         : ''
   }

   if (node.strokeStyleId) {
      switch (node.strokeStyleId) {
         case 'SOLID':
            cssProps['border-style'] = 'solid'
            break
         case 'DASHED':
            cssProps['border-style'] = 'dashed'
            break
         case 'DOTTED':
            cssProps['border-style'] = 'dotted'
            break
         default:
            cssProps['border-style'] = 'solid'
            break
      }
   }

   return cssProps
}
