import { describe, expect, test } from 'vitest'
import { convertToStyleAndClassAttrs } from '../src/convertToStyleAndClassAttrs'
import { BaseConvertSettings } from '../src/types'

const common: BaseConvertSettings = {
   enableTailwindcss: false,
   targetRuntimeEnv: 'web',
   targetRuntimeDsl: 'html',
   enablePxConvert: false,
   pxConvertConfigs: {
      pxConvertFormat: 'rem',
      viewportWidth: 750,
      baseFontSize: 16,
   },
}

describe('convertToStyleAndClass', () => {
   describe('convertToStyleAndClass', () => {
      test('基本用例', () => {
         const input = {
            'background-color': '#000',
            'border-radius': '10px',
            other: 'other',
            other1: 'other1',
         }

         expect(
            convertToStyleAndClassAttrs(input, {
               ...common,
               enableTailwindcss: true,
            }),
         ).toMatchInlineSnapshot(`
           "style=\\"other: other;
           other1: other1;\\" class=\\"bg-[#000] rounded-[10px]\\""
         `)

         expect(
            convertToStyleAndClassAttrs(input, {
               ...common,
               enableTailwindcss: false,
            }),
         ).toMatchInlineSnapshot(`
        "style=\\"background-color: #000;
        border-radius: 10px;
        other: other;
        other1: other1;\\" "
      `)
      })

      test('enablePxConvert 为 true，pxConvertFormat 为 rem', () => {
         const input = {
            width: '100px',
            height: '200px',
            margin: '10px',
            padding: '20px',
         }

         expect(
            convertToStyleAndClassAttrs(input, {
               ...common,
               enablePxConvert: true,
               pxConvertConfigs: {
                  pxConvertFormat: 'rem',
                  viewportWidth: 750,
                  baseFontSize: 16,
               },
            }),
         ).toMatchInlineSnapshot(`
           "style=\\"width: 6.25rem;
           height: 12.5rem;
           margin: 0.625rem;
           padding: 1.25rem;\\" "
         `)
      })

      test('enablePxConvert 为 true，pxConvertFormat 为 vw', () => {
         const input = {
            width: '100px',
            height: '200px',
            margin: '10px',
            padding: '20px',
         }

         expect(
            convertToStyleAndClassAttrs(input, {
               ...common,
               enablePxConvert: true,
               pxConvertConfigs: {
                  pxConvertFormat: 'vw',
                  viewportWidth: 100,
                  baseFontSize: 16,
               },
            }),
         ).toMatchInlineSnapshot(`
           "style=\\"width: 100vw;
           height: 200vw;
           margin: 10vw;
           padding: 20vw;\\" "
         `)
      })
   })
})
