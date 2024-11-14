/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

/* eslint-env node */


const path = require('path');
const {
  DefinePlugin,
  NormalModuleReplacementPlugin
} = require('webpack');

// Karma configuration
// Generated on Wed Nov 06 2024 10:50:06 GMT+0100 (Central European Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: [ 'webpack', 'mocha', 'sinon-chai' ],


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
        new DefinePlugin({
          'process.env': JSON.stringify(process.env)
        }),
        new NormalModuleReplacementPlugin(
          /^preact(\/[^/]+)?$/,
          function(resource) {

            const replMap = {
              'preact/hooks': path.resolve('node_modules/@bpmn-io/properties-panel/preact/hooks/dist/hooks.module.js'),
              'preact/jsx-runtime': path.resolve('node_modules/@bpmn-io/properties-panel/preact/jsx-runtime/dist/jsxRuntime.module.js'),
              'preact': path.resolve('node_modules/@bpmn-io/properties-panel/preact/dist/preact.module.js')
            };

            const replacement = replMap[resource.request];

            if (!replacement) {
              return;
            }

            resource.request = replacement;
          }
        ),
        new NormalModuleReplacementPlugin(
          /^preact\/hooks/,
          path.resolve('node_modules/@bpmn-io/properties-panel/preact/hooks/dist/hooks.module.js')
        )
      ],

      module: {
        rules: [
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
            test: /\.(bpmn|cmmn|dmn|form|robot|rpa|svg)$/,
            type: 'asset/source'
          }
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
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity
  });
};
