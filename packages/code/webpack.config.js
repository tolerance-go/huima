const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {
   return {
      mode:
         env.WEBPACK_WATCH || env.WEBPACK_SERVE ? 'development' : 'production',
      // This is necessary because Figma's 'eval' works differently than normal eval
      devtool: env.WEBPACK_BUNDLE ? 'inline-source-map' : false,
      entry: {
         code: './src/code.ts', // This is the entry point for our plugin code.
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
         path: process.env.IS_JSSJ
            ? path.resolve(__dirname, '../../jssj-plugin')
            : path.resolve(__dirname, '../../figma-plugin'),
      },
   }
}
