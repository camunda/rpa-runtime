/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React from 'react';

import TestContainer from 'mocha-test-container-support';
import { createRoot } from 'react-dom/client';

import { RPAEditor } from './index.js';

import DebugTab from './testing-tab/index.js';

import testRPA from './integration.Spec.rpa';
import TestRPAScriptForm from './testing-tab/RunDialog.js';

import mockResult from './testing-tab/mockResult.Spec.json';

import './integration.Spec.scss';

const singleStart = process.env.SINGLE_START === 'true';

describe('Integration', function() {

  let container, editorContainer, outputTab, propertiesContainer;

  beforeEach(function() {
    container = TestContainer.get(this);

    container.parentNode.style.height = '90vh';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const editor = document.createElement('div');
    editor.style.height = '70%';
    editor.style.width = '100%';
    editor.style.display = 'flex';
    container.appendChild(editor);

    editorContainer = document.createElement('div');
    editorContainer.style.height = '100%';
    editorContainer.style.width = '70%';
    editor.appendChild(editorContainer);

    propertiesContainer = document.createElement('div');
    propertiesContainer.style.height = '100%';
    propertiesContainer.style.width = '30%';
    editor.appendChild(propertiesContainer);

    outputTab = document.createElement('div');
    outputTab.style.height = '30%';
    outputTab.style.width = '100%';
    outputTab.style.borderTop = '1px solid #ccc';
    container.appendChild(outputTab);

  });

  (singleStart ? it.only : it)('should import RPA file', async function() {

    const handleChanged = function(script) {
      console.log(script);
    };

    const editor = RPAEditor({
      onChanged: handleChanged,
      container: editorContainer,
      workerConfig: {
        location: 'localhost',
        port: 36227
      },
      propertiesPanel: {
        container: propertiesContainer
      },
      value: testRPA
    });

    const eventBus = editor.eventBus;

    const root = createRoot(outputTab);
    root.render(<DebugTab editor={ editor } />);

    eventBus.on('dialog.run.open', function(event) {
      const runContainer = document.createElement('div');
      runContainer.style.height = '300px';
      runContainer.style.width = '300px';
      runContainer.style.position = 'absolute';
      runContainer.style.top = '10px';
      runContainer.style.left = '10px';
      runContainer.style.backgroundColor = 'white';
      runContainer.style.border = '1px solid #ccc';

      container.appendChild(runContainer);

      const runRoot = createRoot(runContainer);
      runRoot.render(<TestRPAScriptForm
        onSubmit={ () => {
          console.log('onSubmit');
        } }
        editor={ editor }
      />);

      eventBus.on('script.run', function() {
        runRoot.unmount();

        const button = document.createElement('button');
        button.textContent = 'Advance';
        button.addEventListener('click', function() {
          eventBus.fire('script.run.result', mockResult);
          runContainer.remove();
        });

        runContainer.appendChild(button);
      });
    });




  });

});