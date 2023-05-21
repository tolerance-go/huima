export const findSolidPaint = (fills: readonly Paint[] | symbol) => {
   if (Array.isArray(fills)) {
      const solidFill = [...(fills as readonly Paint[])]
         .reverse()
         .find((fill) => {
            return fill.visible && fill.type === 'SOLID'
         }) as SolidPaint | undefined

      return solidFill
   }

   return undefined
}
