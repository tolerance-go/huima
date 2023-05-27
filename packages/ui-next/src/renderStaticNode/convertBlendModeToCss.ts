export function convertBlendModeToCss(blendMode: BlendMode): string {
   let cssBlendMode: string

   switch (blendMode) {
      case 'PASS_THROUGH':
      case 'NORMAL':
         cssBlendMode = 'normal'
         break
      case 'DARKEN':
         cssBlendMode = 'darken'
         break
      case 'MULTIPLY':
         cssBlendMode = 'multiply'
         break
      case 'LINEAR_BURN':
      case 'COLOR_BURN':
         cssBlendMode = 'color-burn'
         break
      case 'LIGHTEN':
         cssBlendMode = 'lighten'
         break
      case 'SCREEN':
         cssBlendMode = 'screen'
         break
      case 'LINEAR_DODGE':
      case 'COLOR_DODGE':
         cssBlendMode = 'color-dodge'
         break
      case 'OVERLAY':
         cssBlendMode = 'overlay'
         break
      case 'SOFT_LIGHT':
         cssBlendMode = 'soft-light'
         break
      case 'HARD_LIGHT':
         cssBlendMode = 'hard-light'
         break
      case 'DIFFERENCE':
         cssBlendMode = 'difference'
         break
      case 'EXCLUSION':
         cssBlendMode = 'exclusion'
         break
      case 'HUE':
         cssBlendMode = 'hue'
         break
      case 'SATURATION':
         cssBlendMode = 'saturation'
         break
      case 'COLOR':
         cssBlendMode = 'color'
         break
      case 'LUMINOSITY':
         cssBlendMode = 'luminosity'
         break
      default:
         cssBlendMode = 'normal'
         break
   }

   return `mix-blend-mode: ${cssBlendMode};`
}
