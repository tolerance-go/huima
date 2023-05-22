export function getRotationStyle({ rotation }: Pick<FrameNode, 'rotation'>) {
   if (rotation) {
      const rotationDegrees = -rotation

      return {
         transform: `rotate(${rotationDegrees}deg)`,
         'transform-origin': 'center center',
      }
   }
}
