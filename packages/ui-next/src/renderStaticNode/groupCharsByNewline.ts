import { StaticTextNode } from '@huima/types-next'

export function groupCharsByNewline(
   chars: StaticTextNode['styledCharacters'],
): StaticTextNode['styledCharacters'][] {
   const groups: StaticTextNode['styledCharacters'][] = []
   let currentGroup: StaticTextNode['styledCharacters'] = []

   chars.forEach((charInfo) => {
      if (charInfo.char === '\n') {
         // Start a new group when encountering a newline
         if (currentGroup.length > 0) {
            groups.push(currentGroup)
         }
         currentGroup = []
      } else {
         currentGroup.push(charInfo)
      }
   })

   // Push the last group if it's not empty
   if (currentGroup.length > 0) {
      groups.push(currentGroup)
   }

   return groups
}
