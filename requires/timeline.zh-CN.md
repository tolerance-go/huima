pool

-  支持启用图片压缩
-  支持启用图片转 base64
-  支持外部组件引用的多文件导出
-  支持 react 语法转换
-  支持 vue 语法转换
-  支持小程序原生语法转换
-  refactor: nodeInfo 新增 relativePosition，始终为相对父节点的坐标
-  refactor: textContent 移动到 children 中，联合类型增加一项 string
-  refactor: DomNodeTree 增加节点类型
-  refactor: 新增 BaseNodeTree 及到 DomNodeTree 的转换

2023/5/18

-  fix: 解决复制代码时，图片 url 依赖内部环境的问题
-  feat: 支持导出代码，图片资源同步下载

2023/5/19

-  feat: 支持调整视口尺寸
-  feat: 支持启用 px 单位转换
-  fix: 修复 playground 全局样式污染问题

2023/5/20

-  feat: 支持启用 CSS 转 Tailwindcss

2023/5/22

-  feat: 支持界面提示语国际化
-  feat: 支持背景渐变色转换
-  feat: 支持 Mask 导出 SVG
-  feat: 支持节点旋转渲染
-  feat: 支持文本多段样式转换
-  feat: 支持文本有序，无序列表

next

2023/5/23

-  feat: 支持 effects 样式转换
