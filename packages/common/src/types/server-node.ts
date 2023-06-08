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

/**
 * imageFillSrc 既满足了 isA 的继承关系，又符合实际设计目的
 */
export type ServerFrameNode = Omit<StaticFrameNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
}

export type ServerComponentNode = Omit<StaticComponentNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
}

export type ServerInstanceNode = Omit<StaticInstanceNode, 'children'> & {
   imageFillSrc?: string
   children: ServerNode[]
}

export type ServerRectangleNode = StaticRectangleNode & {
   imageFillSrc?: string
}

export type ServerEllipseNode = StaticEllipseNode & {
   imageFillSrc?: string
}

export type ServerGroupNode = Omit<StaticGroupNode, 'children'> & {
   children: ServerNode[]
}

export type ServerTextNode = StaticTextNode
export type ServerLineNode = StaticLineNode
export type ServerVectorNode = StaticVectorNode
export type ServerBooleanOperationNode = StaticBooleanOperationNode
export type ServerPolygonNode = StaticPolygonNode
export type ServerStarNode = StaticStarNode

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
