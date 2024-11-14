/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import * as monaco from 'monaco-editor';
import './editorConfig.js';

/**
 * Create a new Monaco editor instance.
 *
 * @param {HTMLElement} container
 * @param {monaco.editor.IStandaloneEditorConstructionOptions} options
 * @returns {monaco.editor.IStandaloneCodeEditor}
 */
export function createEditor(container, { eventBus, ...options }) {

  const editor = monaco.editor.create(container, { language: 'robotframework', automaticLayout: true, ...options });

  // Get changes to the model and notify eventBus
  editor.onDidChangeModelContent(() => {
    eventBus.fire('property.change', {
      key: 'script',
      value: editor.getValue()
    });
  });

  return editor;
}

export { monaco };