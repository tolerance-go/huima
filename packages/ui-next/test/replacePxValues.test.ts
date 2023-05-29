import { describe, expect, test } from 'vitest'
import { replacePxValues } from '../src/utils/replacePxValues'

describe('replacePxValues', () => {
   test('should replace px values with rem values', () => {
      const result = replacePxValues('10px 20px 30px', (value) => {
         const remValue = value / 16 + 'rem'
         return remValue
      })
      expect(result).toBe('0.625rem 1.25rem 1.875rem')
   })

   test('should handle decimal px values', () => {
      const result = replacePxValues('10.5px 15.75px', (value) => {
         const remValue = value / 16 + 'rem'
         return remValue
      })
      expect(result).toBe('0.65625rem 0.984375rem')
   })

   test('should handle multiple occurrences of px values', () => {
      const result = replacePxValues('20px 30px 40px', (value) => {
         const remValue = value / 16 + 'rem'
         return remValue
      })
      expect(result).toBe('1.25rem 1.875rem 2.5rem')
   })

   test('should preserve non-px values', () => {
      const result = replacePxValues('10px 20rem 30px', (value) => {
         const remValue = value / 16 + 'rem'
         return remValue
      })
      expect(result).toBe('0.625rem 20rem 1.875rem')
   })
})
