export function convertRotationToCss(rotation: number) {
   return {
      transform: `rotate(${-rotation}deg)`,
   }
}
