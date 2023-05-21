export const findImagePaint = (fills: readonly Paint[] | symbol) => {
   if (Array.isArray(fills)) {
      const paint = [...(fills as readonly Paint[])].reverse().find((fill) => {
         return fill.visible && fill.type === 'IMAGE'
      }) as ImagePaint | undefined

      return paint
   }

   return undefined
}
