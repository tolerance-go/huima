export const findGradientLinearPaint = (fills: readonly Paint[] | symbol) => {
   if (Array.isArray(fills)) {
      const paint = [...(fills as readonly Paint[])].reverse().find((fill) => {
         return fill.visible && fill.type === 'GRADIENT_LINEAR'
      }) as GradientPaint | undefined

      return paint
   }

   return undefined
}
