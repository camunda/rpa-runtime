/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

const path = require('path');

// const CamundaModelerWebpackPlugin = require('camunda-modeler-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'client.js'
  },
  plugins: [

    // new CamundaModelerWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /[/\\][A-Z][^/\\]+\.svg$/,
        use: 'react-svg-loader'
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(bpmn|cmmn|dmn|form|robot|rpa)$/,
        type: 'asset/source'
      },

      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [ '@babel/preset-react' ]
      //     }
      //   }
      // }
    ]
  },
  devtool: 'cheap-module-source-map'
};
