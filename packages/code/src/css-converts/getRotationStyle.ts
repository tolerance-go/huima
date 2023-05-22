export function getRotationStyle({
   rotation,
   type,
}: Pick<FrameNode, 'rotation'> & {
   type: SceneNode['type']
}) {
   if (type === 'LINE' || type === 'VECTOR') {
      return {}
   }

   if (rotation) {
      const rotationDegrees = -rotation

      return {
         transform: `rotate(${rotationDegrees}deg)`,
         'transform-origin': 'center center',
      }
   }
}
