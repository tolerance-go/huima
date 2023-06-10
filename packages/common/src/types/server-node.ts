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

export type ServerNodeTag = {
   serverNode?: true
}

/**
 * imageFillSrc 既满足了 isA 的继承关系，又符合实际设计目的
 */
export type ServerFrameNode = Omit<StaticFrameNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
} & ServerNodeTag

export type ServerComponentNode = Omit<StaticComponentNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
} & ServerNodeTag

export type ServerInstanceNode = Omit<StaticInstanceNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
} & ServerNodeTag

export type ServerRectangleNode = StaticRectangleNode & {
   imageFillSrc?: string
} & ServerNodeTag

export type ServerEllipseNode = StaticEllipseNode & {
   imageFillSrc?: string
   svgStr?: string
} & ServerNodeTag

export type ServerGroupNode = Omit<StaticGroupNode, 'children'> & {
   children: ServerNode[]
   svgStr?: string
} & ServerNodeTag

export type ServerTextNode = StaticTextNode & ServerNodeTag
export type ServerLineNode = StaticLineNode & {
   svgStr?: string
} & ServerNodeTag
export type ServerVectorNode = StaticVectorNode & {
   svgStr?: string
} & ServerNodeTag
export type ServerBooleanOperationNode = StaticBooleanOperationNode & {
   svgStr?: string
} & ServerNodeTag
export type ServerPolygonNode = StaticPolygonNode & {
   svgStr?: string
} & ServerNodeTag
export type ServerStarNode = StaticStarNode & {
   svgStr?: string
} & ServerNodeTag

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
