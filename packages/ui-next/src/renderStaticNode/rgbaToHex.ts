// Convert RGB to Hex
export function rgbaToHex(
   r: number,
   g: number,
   b: number,
   a: number = 1,
): string {
   r = Math.floor(r * 255)
   g = Math.floor(g * 255)
   b = Math.floor(b * 255)
   a = Math.floor(a * 255)
   return (
      '#' +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) +
      (a < 16 ? '0' : '') +
      a.toString(16)
   )
}
