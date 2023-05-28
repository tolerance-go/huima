export function convertTextCaseToCss(textCase: TextCase) {
   let cssTextTransform: Record<string, string> = {}

   switch (textCase) {
      case 'ORIGINAL':
         cssTextTransform['text-transform'] = 'none'
         break
      case 'UPPER':
         cssTextTransform['text-transform'] = 'uppercase'
         break
      case 'LOWER':
         cssTextTransform['text-transform'] = 'lowercase'
         break
      case 'TITLE':
         cssTextTransform['text-transform'] = 'capitalize'
         break
      case 'SMALL_CAPS':
      case 'SMALL_CAPS_FORCED':
         cssTextTransform['text-transform'] = 'lowercase'
         break
      default:
         cssTextTransform['text-transform'] = 'none'
         break
   }

   return cssTextTransform
}
