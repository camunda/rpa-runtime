/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

// Karma configuration
// Generated on Wed Nov 06 2024 10:50:06 GMT+0100 (Central European Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: [ 'mocha', 'webpack' ],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'lib/**/*Spec.js', type: 'module' },
      { pattern: 'tmp/_karma_webpack_*/**/*', included: false, served: true, watched: true, nocache: true }
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'lib/**/*.js': [ 'webpack' ]
    },

    webpack: {
      mode: 'none',

      plugins: [
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
            test: /\.(bpmn|cmmn|dmn|form|robot)$/,
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

      resolve: {
        mainFields: [
          'dev:module',
          'browser',
          'module',
          'main'
        ],
        modules: [
          'node_modules'
        ],
      },
      devtool: 'eval-cheap-module-source-map'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: [ 'progress' ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: [ 'ChromeHeadless' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity
  });
};
