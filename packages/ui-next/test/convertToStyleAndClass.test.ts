import { describe, expect, test } from 'vitest'
import { convertToStyleAndClassAttrs } from '../src/renderStaticNode/convertToStyleAndClassAttrs'

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
               enableTailwindcss: true,
               targetRuntimeEnv: 'web',
               targetRuntimeDsl: 'html',
            }),
         ).toEqual(
            `style="other: other;
other1: other1;" class="bg-[#000] rounded-[10px]"`,
         )

         expect(
            convertToStyleAndClassAttrs(input, {
               enableTailwindcss: false,
               targetRuntimeEnv: 'web',
               targetRuntimeDsl: 'html',
            }),
         ).toMatchInlineSnapshot(`
           "style=\\"background-color: #000;
           border-radius: 10px;
           other: other;
           other1: other1;\\" "
         `)
      })
   })
})
