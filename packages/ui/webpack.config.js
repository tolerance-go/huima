const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

module.exports = (env, argv) => {
   return {
      mode:
         env.WEBPACK_WATCH || env.WEBPACK_SERVE ? 'development' : 'production',
      devServer: {
         compress: true,
         port: 9000,
         hot: true, // 启用热更新
      },
      // This is necessary because Figma's 'eval' works differently than normal eval
      devtool: env.WEBPACK_BUNDLE ? 'inline-source-map' : false,
      entry: {
         ui: './src/ui.ts', // This is the entry point for our plugin code.
      },
      module: {
         rules: [
            {
               test: /\.css$/,
               use: [
                  'style-loader',
                  // 选项 importLoaders: 1 指的是，对于 @import 进来的资源，它们也需要经过前面 1 个 loader（即 postcss-loader）的处理。
                  { loader: 'css-loader', options: { importLoaders: 1 } },
                  'postcss-loader',
               ],
               exclude: /node_modules/,
            },
            // Converts TypeScript code to JavaScript
            {
               test: /\.tsx?$/,
               use: 'ts-loader',
               exclude: /node_modules/,
            },
         ],
      },
      // Webpack tries these extensions for you if you omit the extension like "import './file'"
      resolve: {
         extensions: ['.ts', '.js'],
      },
      output: {
         filename: '[name].js',
         path: process.env.IS_JSSJ
            ? path.resolve(__dirname, '../../jssj-plugin')
            : path.resolve(__dirname, '../../figma-plugin'),
      },
      externals: {
         'prettier/standalone': 'prettier',
         'prettier/parser-html': 'prettierPlugins.html',
         prismjs: 'Prism',
         clipboard: 'ClipboardJS',
         vue: 'Vue',
         jszip: 'JSZip',
      },
      plugins: [
         new HtmlWebpackPlugin({
            template: 'src/ui.html',
            filename: env.WEBPACK_SERVE ? 'index.html' : 'ui.html',
            inject: 'body',
         }),
         new ScriptExtHtmlWebpackPlugin({
            inline: /ui.js$/, // 将匹配这个正则表达式的文件内联到 HTML 中
         }),
         new ExtraWatchWebpackPlugin({
            files: ['src/**/*.ts'], // 监听 script 重新生成 html
         }),
         new webpack.DefinePlugin({
            'process.env.WEBPACK_SERVE': JSON.stringify(
               process.env.WEBPACK_SERVE,
            ),
         }),
      ],
   }
}
