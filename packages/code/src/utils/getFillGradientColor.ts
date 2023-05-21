export function getFillGradientColor(gradientPaint: GradientPaint) {
   // Get the array of color stops
   const gradientStops = gradientPaint.gradientStops
   // Convert each color stop to a CSS color stop
   const cssColorStops = gradientStops.map((stop) => {
      const { r, g, b, a } = stop.color
      const rgbaColor = `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`
      const cssPosition = `${stop.position * 100}%`
      return `${rgbaColor} ${cssPosition}`
   })
   const cssGradient = `linear-gradient(${cssColorStops.join(', ')})`
   return cssGradient
}
