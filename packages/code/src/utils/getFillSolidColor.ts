export const getFillSolidColor = (solidFill: SolidPaint): string => {
   const { r, g, b } = solidFill.color
   const opacity = solidFill.opacity
   const rgbaColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${opacity})`
   return rgbaColor
}
