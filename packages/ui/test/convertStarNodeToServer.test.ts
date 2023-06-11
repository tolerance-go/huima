import {
   BaseUploadSettings,
   ImageFillMeta,
   ServerStarNode,
   StaticNode,
   StaticStarNode,
} from '@huima/common/dist/types'
import { Buffer } from 'buffer'
import { describe, expect, test } from 'vitest'
import { convertStarNodeToServer } from '../src/utils/createServerNode/convertStarNodeToServer'
import { ServerNodeConvertHooks } from '../src/utils/createServerNode/types'

describe('convertStarNodeToServer', () => {
   const settings: BaseUploadSettings = {} // 初始化你的设置对象；
   const hooks: ServerNodeConvertHooks = {
      convertImageFillMetaBytesToAssertUrl: (
         imageFillMeta: ImageFillMeta,
         node: StaticNode,
      ) => {
         return '/upload/' + node.name + imageFillMeta.imageExtension
      },
   } // 初始化你的钩子对象；

   test('should correctly convert basic star node', () => {
      const starNode: StaticStarNode = {
         svgBytes: new Uint8Array([0, 1, 2, 3]),
         type: 'star',
         name: 'star',
         id: 'star',
         x: 0,
         y: 0,
         width: 100,
         height: 100,
         effects: [],
         strokes: [],
         constraints: {
            vertical: 'MIN',
            horizontal: 'MIN',
         },
         rotation: 0,
         blendMode: 'PASS_THROUGH',
         absoluteBoundingBox: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
         },
         absoluteRenderBounds: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
         },
         absoluteTransform: [
            [1, 0, 0],
            [0, 1, 0],
         ],
         layoutPositioning: 'AUTO',
         isMask: false,
         fills: [],
         strokeAlign: 'INSIDE',
         dashPattern: [],
         strokeWeight: 1,
      }

      const expectedOutput: ServerStarNode = {
         ...starNode,
         serverNode: true,
         svgStr: Buffer.from(starNode.svgBytes).toString(),
         svgBytes: new Uint8Array(0),
      }

      const serverNode = convertStarNodeToServer(settings, starNode, hooks)

      expect(serverNode).toEqual(expectedOutput)
   })
})
