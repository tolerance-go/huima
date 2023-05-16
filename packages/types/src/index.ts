import "./global";

export type CSSStyle = Record<string, string | number | undefined>;

export interface NodeTree {
  tag: string;
  style: CSSStyle;
  children: NodeTree[];
  textContent?: string;
  styleMeta?: Record<string, any>;
}

export type UIEvents = {
  selectionchange: {
    name: string;
    id: string;
  };
  startGen: {
    name: string;
    id: string;
    nodeTree: NodeTree;
  };
};

export type UIAction<K extends keyof UIEvents> = {
  type: K;
  payload: UIEvents[K];
};
