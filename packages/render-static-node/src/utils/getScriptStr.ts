// 单独函数，解决在 .vue 文件中的模板中使用 <script> 标签时，会冲突的问题
export const getScriptStr = ({
   src = '',
   onLoad = '',
   content = '',
}: {
   src?: string
   onLoad?: string
   content?: string
}) => {
   // src 和 content 不能同时存在
   return `<script ${
      src ? `src="${src}"` : ''
   } onload="${onLoad}">${content}</script>`
}
