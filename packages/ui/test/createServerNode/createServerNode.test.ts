import {
   BaseUploadSettings,
   ImageFillMeta,
   ServerVectorNode,
   StaticNode,
   StaticVectorNode,
} from '@huima/common/dist/types'
import { renderStaticNode } from '@huima/render-static-node'
import { Buffer } from 'buffer'
import { describe, expect, test } from 'vitest'
import { createServerNode } from '../../src/utils/createServerNode/createServerNode'
import { ServerNodeConvertHooks } from '../../src/utils/createServerNode/types'
import groupData from './group.json'

describe('createServerNode', () => {
   const settings: BaseUploadSettings = {} // 初始化你的设置对象；
   const hooks: ServerNodeConvertHooks = {
      convertImageFillMetaBytesToAssertUrl: (
         imageFillMeta: ImageFillMeta,
         node: StaticNode,
      ) => {
         return '/upload/' + node.name + imageFillMeta.imageExtension
      },
   } // 初始化你的钩子对象；

   test('删除 parent 对象', () => {
      const starNode: StaticVectorNode = {
         svgBytes: new Uint8Array([0, 1, 2, 3]),
         type: 'vector',
         name: 'vector',
         id: 'vector',
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
         parent: {
            type: 'frame',
            name: 'instanceNode',
            id: 'instanceNode',
            cornerRadius: 0,
            children: [],
            layoutMode: 'NONE',
            itemSpacing: 0,
            paddingLeft: 0,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            counterAxisAlignItems: 'MIN',
            primaryAxisAlignItems: 'MIN',
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
         },
      }

      const expectedOutput: ServerVectorNode = {
         ...starNode,
         serverNode: true,
         svgStr: Buffer.from(starNode.svgBytes).toString(),
         svgBytes: new Uint8Array(0),
         parent: undefined,
      }

      const serverNode = createServerNode(settings, starNode, hooks)

      expect(serverNode).toEqual(expectedOutput)
   })

   test('group 嵌套', () => {
      expect(
         renderStaticNode(
            {
               enableTailwindcss: false,
               targetRuntimeEnv: 'web',
               targetRuntimeDsl: 'html',
               enablePxConvert: false,
               pxConvertConfigs: {
                  pxConvertFormat: 'rem',
                  viewportWidth: 0,
                  baseFontSize: 0,
               },
            },
            createServerNode(
               settings,
               groupData as unknown as StaticNode,
               hooks,
            ),
         ),
      ).toMatchInlineSnapshot(`
        "<div role='frame' style=\\"width: 238px;
        height: 397px;
        border-radius: 0px;
        background-color: #ffffffff;
        transform: rotate(-3.1805546814635168e-15deg);\\" >
            <div role=\\"group\\" style=\\"width: 90px;
        height: 249px;
        transform: rotate(0deg);
        position: absolute;
        left: 47px;
        top: 60px;\\" ><div style=\\"width: 90px;
        height: 71px;
        border-radius: 0px;
        background-color: #d9d9d9ff;
        position: absolute;
        left: 0px;
        top: 0px;\\" ></div>
        <div style=\\"width: 90px;
        height: 71px;
        border-radius: 0px;
        background-color: #d9d9d9ff;
        position: absolute;
        left: 0px;
        top: 0px;\\" ></div>
        <div style=\\"width: 90px;
        height: 71px;
        border-radius: 0px;
        background-color: #d9d9d9ff;
        position: absolute;
        left: 0px;
        top: 0px;\\" ></div></div></div>"
      `)
   })
})
