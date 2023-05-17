const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

module.exports = (env, argv) => ({
   mode: argv.mode === 'production' ? 'production' : 'development',

   // This is necessary because Figma's 'eval' works differently than normal eval
   devtool: argv.mode === 'production' ? false : 'inline-source-map',
   entry: {
      ui: './src/ui.ts', // This is the entry point for our plugin code.
   },
   module: {
      rules: [
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
      path: path.resolve(__dirname, 'dist'),
   },
   externals: {
      vue: 'Vue',
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: 'src/ui.html',
         filename: 'ui.html',
         inject: 'body',
      }),
      new ScriptExtHtmlWebpackPlugin({
         inline: /ui.js$/, // 将匹配这个正则表达式的文件内联到 HTML 中
      }),
      new ExtraWatchWebpackPlugin({
         files: ['src/*.ts'], // 监听 script 重新生成 html
      }),
   ],
})
