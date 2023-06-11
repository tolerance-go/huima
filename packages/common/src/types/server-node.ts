/**
 * ServerNode isA StaticNode
 */
import {
   StaticBooleanOperationNode,
   StaticComponentNode,
   StaticEllipseNode,
   StaticFrameNode,
   StaticGroupNode,
   StaticInstanceNode,
   StaticLineNode,
   StaticPolygonNode,
   StaticRectangleNode,
   StaticStarNode,
   StaticTextNode,
   StaticVectorNode,
} from './static-node'

export type ServerNodeBase = {
   serverNode?: true
   parentId?: string
}

/**
 * imageFillSrc 既满足了 isA 的继承关系，又符合实际设计目的
 */
export type ServerFrameNode = Omit<StaticFrameNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
} & ServerNodeBase

export type ServerComponentNode = Omit<StaticComponentNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
} & ServerNodeBase

export type ServerInstanceNode = Omit<StaticInstanceNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
} & ServerNodeBase

export type ServerRectangleNode = StaticRectangleNode & {
   imageFillSrc?: string
} & ServerNodeBase

export type ServerEllipseNode = StaticEllipseNode & {
   imageFillSrc?: string
   svgStr?: string
} & ServerNodeBase

export type ServerGroupNode = Omit<StaticGroupNode, 'children'> & {
   children: ServerNode[]
   svgStr?: string
} & ServerNodeBase

export type ServerTextNode = StaticTextNode & ServerNodeBase
export type ServerLineNode = StaticLineNode & {
   svgStr?: string
} & ServerNodeBase
export type ServerVectorNode = StaticVectorNode & {
   svgStr?: string
} & ServerNodeBase
export type ServerBooleanOperationNode = StaticBooleanOperationNode & {
   svgStr?: string
} & ServerNodeBase
export type ServerPolygonNode = StaticPolygonNode & {
   svgStr?: string
} & ServerNodeBase
export type ServerStarNode = StaticStarNode & {
   svgStr?: string
} & ServerNodeBase

export type ServerAtomNode =
   | ServerTextNode
   | ServerRectangleNode
   | ServerEllipseNode
   | ServerLineNode
   | ServerVectorNode
   | ServerStarNode
   | ServerPolygonNode
   | ServerBooleanOperationNode

export type ServerNode = ServerAtomNode | ServerContainerNode

export type ServerContainerNode =
   | ServerFrameNode
   | ServerGroupNode
   | ServerComponentNode
   | ServerInstanceNode
// | StaticSectionNode
