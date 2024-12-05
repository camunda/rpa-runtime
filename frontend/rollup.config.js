/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import path from 'path';
import { defineConfig } from 'rollup';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import { string } from 'rollup-plugin-string';
import json from '@rollup/plugin-json';
import { dependencies, peerDependencies } from './package.json';


const preactReplacement = {
  'preact/hooks': path.resolve('node_modules/@bpmn-io/properties-panel/preact/hooks/dist/hooks.module.js'),
  'preact/jsx-runtime': path.resolve('node_modules/@bpmn-io/properties-panel/preact/jsx-runtime/dist/jsxRuntime.module.js'),
  'preact': path.resolve('node_modules/@bpmn-io/properties-panel/preact/dist/preact.module.js')
};

const plugins = [
  {
    name: 'preact-replacement',
    resolveId(source) {
      return preactReplacement[source] || null;
    }
  },
  nodeResolve({
    mainFields: [ 'dev:module', 'browser', 'module', 'main' ],
    extensions: [ '.js', '.jsx', '.json' ]
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    plugins: [ '@babel/plugin-transform-react-jsx' ]
  }),
  commonjs(),
  postcss({
    extract: false,
    modules: false,
    use: [ 'sass' ]
  }),
  string({
    include: '**/*.svg'
  }),
  json()
];

export default defineConfig([
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/client.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    plugins: plugins,
    external: externalDependencies()
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/client.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: plugins,
    external: externalDependencies()
  }
]);


const nonbundledDependencies = Object.keys({ ...dependencies, ...peerDependencies });

function externalDependencies() {
  return id => {
    return nonbundledDependencies.find(dep => id.startsWith(dep));
  };
}
