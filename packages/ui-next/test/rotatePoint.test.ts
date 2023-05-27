import { describe, expect, it } from 'vitest'
import { getCenterPoint, rotatePoint } from '../src/utils/rotatePoint'

// The two tests marked with concurrent will be run in parallel
describe('rotatePoint', () => {
   const rotatedUpperLeft = {
      x: 2562.38,
      y: 1921.51,
   }

   const center = getCenterPoint({
      height: 1548,
      width: 1767,
      x: 2397,
      y: 2077,
   })

   const angleDegree = -11.09

   it('rotatePoint with origin', () => {
      expect(rotatePoint(rotatedUpperLeft, center, angleDegree)).toEqual({
         x: 2397.0019448533517,
         y: 2076.9979450595174,
      })
   })
})
