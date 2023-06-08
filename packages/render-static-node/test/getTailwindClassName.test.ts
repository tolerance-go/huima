import { describe, expect, test } from 'vitest'
import { getTailwindClassName } from '../src/getTailwindClassName'

describe('getTailwindClassName', () => {
   test('background-color', () => {
      expect(getTailwindClassName('background-color', 'red')).toBe('bg-[red]')
   })

   test('background-size', () => {
      expect(getTailwindClassName('background-size', 'cover')).toBe('bg-cover')
   })

   test('background-repeat', () => {
      expect(getTailwindClassName('background-repeat', 'no-repeat')).toBe(
         'bg-no-repeat',
      )
   })

   test('border-radius', () => {
      expect(getTailwindClassName('border-radius', 'md')).toBe('rounded-[md]')
   })

   test('border-color', () => {
      expect(getTailwindClassName('border-color', 'gray-500')).toBe(
         'border-[gray-500]',
      )
   })

   test('border-width', () => {
      expect(getTailwindClassName('border-width', '2')).toBe('border-[2]')
   })

   test('border-style', () => {
      expect(getTailwindClassName('border-style', 'dashed')).toBe(
         'border-dashed',
      )
   })

   test('box-sizing', () => {
      expect(getTailwindClassName('box-sizing', 'border-box')).toBe(
         'box-border',
      )
   })

   test('display', () => {
      expect(getTailwindClassName('display', 'flex')).toBe('flex')
   })

   test('gap', () => {
      expect(getTailwindClassName('gap', '4')).toBe('gap-[4]')
   })

   test('flex-direction', () => {
      expect(getTailwindClassName('flex-direction', 'row')).toBe('flex-row')
   })

   test('padding-left', () => {
      expect(getTailwindClassName('padding-left', '4')).toBe('pl-[4]')
   })

   test('align-items', () => {
      expect(getTailwindClassName('align-items', 'center')).toBe('items-center')
   })

   test('justify-content', () => {
      expect(getTailwindClassName('justify-content', 'center')).toBe(
         'justify-center',
      )
   })

   test('position', () => {
      expect(getTailwindClassName('position', 'absolute')).toBe('absolute')
   })

   test('left', () => {
      expect(getTailwindClassName('left', '1')).toBe('left-[1]')
   })

   test('top', () => {
      expect(getTailwindClassName('top', '2')).toBe('top-[2]')
   })

   test('right', () => {
      expect(getTailwindClassName('right', '3')).toBe('right-[3]')
   })

   test('bottom', () => {
      expect(getTailwindClassName('bottom', '4')).toBe('bottom-[4]')
   })

   test('overflow', () => {
      expect(getTailwindClassName('overflow', 'hidden')).toBe('overflow-hidden')
   })

   test('width', () => {
      expect(getTailwindClassName('width', 'full')).toBe('w-[full]')
   })

   test('height', () => {
      expect(getTailwindClassName('height', '64')).toBe('h-[64]')
   })
})
