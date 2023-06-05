import { describe, expect, test } from 'vitest'
import { isCircle } from '../src/isCircle'

// Vite 测试用例
describe('isCircle function', () => {
   test('manual', () => {
      expect(
         isCircle({
            endingAngle: 4.180924415588379,
            innerRadius: 0,
            startingAngle: 3.1415927410125732,
         }),
      ).toBe(false)
      expect(
         isCircle({
            endingAngle: 6.2831854820251465,
            innerRadius: 0,
            startingAngle: 0,
         }),
      ).toBe(true)
      expect(
         isCircle({
            endingAngle: 6.2831854820251465,
            innerRadius: 0.30508071184158325,
            startingAngle: 0,
         }),
      ).toBe(false)
   })

   test('should return false for a full circle with innerRadius greater than 0', () => {
      const ring = {
         startingAngle: 0,
         endingAngle: 2 * Math.PI,
         innerRadius: 1,
      }
      expect(isCircle(ring)).toBe(false)
   })

   test('should return true for a full circle', () => {
      const fullCircle = {
         startingAngle: 0,
         endingAngle: 2 * Math.PI,
         innerRadius: 0,
      }
      expect(isCircle(fullCircle)).toBe(true)
   })

   test('should return true for a full circle with different starting angle', () => {
      const fullCircle = {
         startingAngle: Math.PI / 2,
         endingAngle: Math.PI / 2 + 2 * Math.PI,
         innerRadius: 0,
      }
      expect(isCircle(fullCircle)).toBe(true)
   })

   test('should return false for a half circle', () => {
      const halfCircle = {
         startingAngle: 0,
         endingAngle: Math.PI,
         innerRadius: 0,
      }
      expect(isCircle(halfCircle)).toBe(false)
   })

   test('should return false for an arc', () => {
      const arc = { startingAngle: 0, endingAngle: Math.PI / 2, innerRadius: 0 }
      expect(isCircle(arc)).toBe(false)
   })
})
