export const getFillSolidColor = (
   fills: readonly Paint[] | symbol,
): string | undefined => {
   if (Array.isArray(fills)) {
      const solidFill = (fills as readonly Paint[]).find((fill) => {
         return fill.visible && fill.type === 'SOLID'
      }) as SolidPaint | undefined

      if (solidFill) {
         const { r, g, b } = solidFill.color
         const opacity = solidFill.opacity
         const rgbaColor = `rgba(${r * 255}, ${g * 255}, ${
            b * 255
         }, ${opacity})`
         return rgbaColor
      }
   }

   return undefined
}
