/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { RPAEditor } from './index.js';

import TestContainer from 'mocha-test-container-support';

import testRPA from './integration.rpa';

const singleStart = process.env.SINGLE_START === 'true';

describe('Integration', function() {

  let container, editorContainer, propertiesContainer;

  beforeEach(function() {
    container = TestContainer.get(this);

    editorContainer = document.createElement('div');
    editorContainer.style.height = '100%';
    editorContainer.style.width = '70%';
    container.appendChild(editorContainer);

    propertiesContainer = document.createElement('div');
    propertiesContainer.style.height = '100%';
    propertiesContainer.style.width = '30%';
    container.appendChild(propertiesContainer);
  });

  (singleStart ? it.only : it)('should import RPA file', async function() {

    container.style.display = 'flex';

    const handleChanged = function(script) {
      console.log(script);
    };

    RPAEditor({
      onChanged: handleChanged,
      container: editorContainer,
      propertiesPanel: {
        container: propertiesContainer
      },
      rpaFile: testRPA
    });
  });

});