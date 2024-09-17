const path = require('path')
const fs = require('fs')
const { HtmlRspackPlugin, CopyRspackPlugin, CssExtractRspackPlugin, DefinePlugin } = require('@rspack/core')
const { argv } = require('process')

if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true })
}

const production = argv.includes('production')

/** @type {import('@rspack/core').Configuration} */
const config = {
  devtool: production ? false : 'eval',
  experiments: {
  },
  entry:  path.join(__dirname, 'src', 'cmd', 'main.tsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            externalHelpers: false,
            parser: {
              syntax: 'typescript',
              decorators: true,
            },
            preserveAllComments: false,
            transform: {
              react: {
                pragma: 'h',
                pragmaFrag: 'Fragment',
                throwIfNamespace: true,
                useBuiltins: false,
              },
            }
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.(sass|scss)$/,
        use: [CssExtractRspackPlugin.loader, 'css-loader', 'sass-loader'],
        type: 'javascript/auto',
      },
      {
        test: /\.(txt)$/,
        type: "asset/resource",
      },
    ]
  },
  plugins: [
    new DefinePlugin({
      production,
      // ...Should probably hide this in the back end
      giphyApiKey: JSON.stringify('CPJRzUOWCUpbPlpeTJ8BgmnTU9Of5yK7')
    }),
    new CssExtractRspackPlugin({}),
    new HtmlRspackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'cmd', 'index.html'),
    }),
    new CopyRspackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx', 'css', 'scss'],
  },
  devServer: {
    hot: false,
    historyApiFallback: true,
  },
}

module.exports = config