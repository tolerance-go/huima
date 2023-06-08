import {
   ImageFillMeta,
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
} from './base'

export type ServerFrameNode = Omit<
   StaticFrameNode,
   'imageFillMeta' | 'children'
> & {
   imageFillMeta?: Omit<ImageFillMeta, 'imageBytes'> & {
      imageSrc?: string
   }
   children: ServerNode[]
}

export type ServerComponentNode = Omit<
   StaticComponentNode,
   'imageFillMeta' | 'children'
> & {
   imageFillMeta?: Omit<ImageFillMeta, 'imageBytes'> & {
      imageSrc?: string
   }
   children: ServerNode[]
}

export type ServerInstanceNode = Omit<
   StaticInstanceNode,
   'imageFillMeta' | 'children'
> & {
   imageFillMeta?: Omit<ImageFillMeta, 'imageBytes'> & {
      imageSrc?: string
   }
   children: ServerNode[]
}

export type ServerRectangleNode = Omit<StaticRectangleNode, 'imageFillMeta'> & {
   imageFillMeta?: Omit<ImageFillMeta, 'imageBytes'> & {
      imageSrc?: string
   }
}

export type ServerEllipseNode = Omit<StaticEllipseNode, 'imageFillMeta'> & {
   imageFillMeta?: Omit<ImageFillMeta, 'imageBytes'> & {
      imageSrc?: string
   }
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
