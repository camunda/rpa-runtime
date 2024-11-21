/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { act } from 'react';

import TestContainer from 'mocha-test-container-support';
import { createRoot } from 'react-dom/client';

import TestingTab from './index.js';

// import testRPA from './integration.rpa';
import mockResult from './mockResult.Spec.json';

global.IS_REACT_ACT_ENVIRONMENT = true;

describe.only('Output', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  it('should show empty state', async function() {

    // given
    await renderTab({
      result: null
    });

    // then
    expect(container.querySelector('.crpa-btm-empty')).to.exist;
  });

  it('should show loading state', async function() {

    // given
    await renderTab({
      result: null,
      loading: true
    });

    // then
    expect(container.querySelector('.crpa-btm-loading')).to.exist;
  });


  it('should show results', async function() {

    // given
    await renderTab({
      result: mockResult
    });

    // then
    expect(container.querySelector('.crpa-btm-results')).to.exist;
    expect(container.querySelector('.crpa-btm-exec-log')).to.exist;
    expect(container.querySelector('.crpa-btm-vars')).to.exist;
    expect(container.querySelector('.crpa-btm-results iframe')).to.exist;
  });


  async function renderTab(props) {
    await act(() => {
      createRoot(container).render(
        <TestingTab
          { ...props }
        />
      );
    });
  }

});