import { describe, expect, test } from 'vitest'

import { convertPxToVw } from '../dist/utils/convertPxToVw'

describe('convertPxToVw', () => {
   test('基本用例', () => {
      expect(convertPxToVw(100, 800)).toBe('12.5vw')
      expect(convertPxToVw(10, 100)).toBe('10vw')
      expect(convertPxToVw(200, 1200)).toBe('16.666666666666668vw')
      expect(convertPxToVw(50, 640)).toBe('7.8125vw')
   })

   test('边界情况', () => {
      expect(convertPxToVw(0, 1024)).toBe('0vw')
      expect(convertPxToVw(1024, 1024)).toBe('100vw')
      expect(convertPxToVw(500, 0)).toBe('Infinityvw')
   })
})
