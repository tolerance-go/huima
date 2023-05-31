export type CharInfo = {
   start: number
   end: number
   char: string
}

export function getCharPositions(chars: string[]): CharInfo[] {
   let position = 0
   return chars.map((char) => {
      const start = position
      const end = position + char.length
      position += char.length
      return { start, end, char }
   })
}
