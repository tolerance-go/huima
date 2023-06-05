const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => {
   return {
      mode:
         env.WEBPACK_WATCH || env.WEBPACK_SERVE ? 'development' : 'production',
      devServer: {
         port: 9000,
         hot: true, // 启用热更新
      },
      // This is necessary because Figma's 'eval' works differently than normal eval
      devtool: env.WEBPACK_BUNDLE ? false : 'inline-source-map',
      entry: {
         ui: './src/ui.ts', // This is the entry point for our plugin code.
      },
      module: {
         rules: [
            {
               test: /\.txt$/,
               loader: 'raw-loader',
               exclude: /node_modules/,
            },
            {
               test: /\.ts$/,
               loader: 'ts-loader',
               options: {
                  appendTsSuffixTo: [/\.vue$/], // 处理在vue文件中使用ts
                  // vue 模板中的  $props, $data 和 $options 变量在 ts 的上下文中没有被使用会报错，
                  // 所以 ts 的 lint 功能关闭，转而未来使用 eslint
                  // transpileOnly 不能开启，否则会导致 vue 文件中的 ts 类型检测失效
               },
               exclude: /node_modules/,
            },
            {
               test: /\.vue$/,
               loader: 'vue-loader', // 添加对 .vue 文件的支持
               exclude: /node_modules/,
            },
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
         ],
      },
      // Webpack tries these extensions for you if you omit the extension like "import './file'"
      resolve: {
         extensions: ['.ts', '.js', '.vue', '.txt'],
      },
      output: {
         publicPath: '/',
         filename: '[name].js',
         path: process.env.IS_JSSJ
            ? path.resolve(__dirname, '../../jssj-plugin')
            : path.resolve(__dirname, '../../figma-plugin'),
      },
      externals: {
         'prettier/standalone': 'prettier',
         'prettier/parser-html': 'prettierPlugins.html',
         'prettier/parser-babel': 'prettierPlugins.babel',
         prismjs: 'Prism',
         clipboard: 'ClipboardJS',
         jszip: 'JSZip',
      },
      cache: false,
      plugins: [
         new Dotenv(),
         new VueLoaderPlugin(),
         new HtmlWebpackPlugin({
            // watch 阶段如果不设置为 false，会导致每次保存都会是老的 ui.html
            cache: env.WEBPACK_WATCH ? false : true,
            template: 'src/ui.html',
            filename: env.WEBPACK_SERVE ? 'index.html' : 'ui.html',
            inject: 'body',
            templateParameters: {
               IS_JSSJ: process.env.IS_JSSJ,
            },
         }),
         new HtmlInlineScriptPlugin({
            scriptMatchPattern: [/ui.js$/],
         }),
         new webpack.DefinePlugin({
            'process.env.WEBPACK_SERVE': JSON.stringify(
               process.env.WEBPACK_SERVE,
            ),
         }),
      ],
   }
}
