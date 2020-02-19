/**
 * @File   : webpack.config.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Tue Oct 15 2019
 * @Description: 
 */
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Mode = process.env.NODE_ENV;
const isDev = Mode !== 'production';

const outPath = path.resolve(__dirname, '../project/Assets/SeinJSUnityToolkit/Previewer/assets');

module.exports = {
  mode: Mode,
  devtool: 'none',

  entry: {
    main: [
      path.resolve(__dirname, `src/index.ts`)
    ].filter(s => !!s)
  },

  output: {
    path: outPath,
    filename: `[name].js`,
    chunkFilename: `[name].js`,
    publicPath: `/previewer/`,
    
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      assets: path.resolve(__dirname, `src/assets`),
      seinjs: path.resolve(__dirname, './node_modules/seinjs/lib/seinjs.umd.js')
      // seinjs: path.resolve(__dirname, '../../../Sein.js/src'),
      // hilo3d: path.resolve(__dirname, '../../../Sein.js/Hilo3d/seinjs-build/Hilo3d.js'),
      // axios: path.resolve(__dirname, '../../../Sein.js/node_modules/axios/dist/axios.js'),
    }
  },
  
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader" 
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 15000,
          }
        }
      },
      {
        test: /\.(gltf|glb)$/,
        use: {
          loader: 'seinjs-gltf-loader',
          options: {
            compress: {
              enabled: false,
              excludes: [/miku/g]
            },
            glb: {
              enabled: false
            },
            base64: {
              enabled: false
            }
          }
        }
      },
      {
        test: /\.atlas$/,
        use: {
          loader: 'seinjs-atlas-loader',
          options: {
            base64: {
              enabled: false
            }
          }
        }
      },
      {
        test: /.(css|scss)$/,
        use: [
          {
            loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
    ]
  },

  optimization: {
    splitChunks: {
      minChunks: 1,
      cacheGroups: {
        seinjs: {
          name: 'seinjs',
          chunks: 'initial',
          test: m => {
            if (m.external) {
              return false;
            }

            return m.rawRequest === 'seinjs' || m.rawRequest === 'seinjs-orig';
          },
          priority: 2
        },
        common: {
          name: 'common',
          chunks: 'initial',
          test: /(node_modules|utils)/,
          priority: 1
        }
      }
    }
  },

  plugins: [
    new CleanWebpackPlugin(
      ['*'],
      {root: outPath}
    ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(Mode)
      }
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].css',
      chunkFilename: isDev ? '[id].css' : '[id].css',
    }),
  ].filter(s => !!s)
};
