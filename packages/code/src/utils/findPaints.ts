export const findPaints = (fills: readonly Paint[] | symbol) => {
   if (Array.isArray(fills)) {
      return (fills as readonly Paint[])
         .filter((fill) => fill.visible)
         .reduce(
            (obj, next) => {
               if (next.type === 'SOLID') {
                  obj.solidPaint = next
               } else if (next.type === 'GRADIENT_LINEAR') {
                  obj.gradientLinearPaint = next
               } else if (next.type === 'GRADIENT_RADIAL') {
                  obj.gradientRadialPaint = next
               } else if (next.type === 'GRADIENT_ANGULAR') {
                  obj.gradientAngularPaint = next
               } else if (next.type === 'GRADIENT_DIAMOND') {
                  obj.gradientDiamondPaint = next
               } else if (next.type === 'IMAGE') {
                  obj.imagePaint = next
               }

               return obj
            },
            {} as {
               solidPaint?: SolidPaint
               gradientLinearPaint?: GradientPaint
               gradientRadialPaint?: GradientPaint
               gradientAngularPaint?: GradientPaint
               gradientDiamondPaint?: GradientPaint
               imagePaint?: ImagePaint
            },
         )
   }

   return {}
}
