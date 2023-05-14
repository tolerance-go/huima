interface PluginAPI {
  on(
    type: "selectionchange" | "currentpagechange" | "close",
    callback: () => void
  ): void;
}
