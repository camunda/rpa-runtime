/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import camundaLicensedPlugin from 'eslint-plugin-camunda-licensed';

import bpmnIoPlugin from 'eslint-plugin-bpmn-io';


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: [ 'lib/**/*.{js,mjs,cjs,jsx}' ] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...bpmnIoPlugin.configs.recommended,
  ...camundaLicensedPlugin.configs.mit,
  ...bpmnIoPlugin.configs.mocha.map(config => {
    return {
      ...config,
      files: [ 'lib/**/*.Spec.js' ]
    };
  })
];