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

import mockResult from './mockResult.Spec.json';

// eslint-disable-next-line no-undef
global.IS_REACT_ACT_ENVIRONMENT = true;

const NOOP = () => {};

describe('Output', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  it('should show empty state', async function() {

    // given
    await renderInfo({
      result: null
    });

    // then
    expect(container.querySelector('.crpa-btm-empty')).to.exist;
  });


  it('should show loading state', async function() {

    // given
    await renderInfo({
      result: null,
      scriptRunning: true
    });

    // then
    expect(container.querySelector('.crpa-btm-loading')).to.exist;
  });


  it('should show loading state when previous run was done', async function() {

    // given
    await renderInfo({
      lastRun: mockResult,
      scriptRunning: true
    });

    // then
    expect(container.querySelector('.crpa-btm-loading')).to.exist;
  });

  it('should show results', async function() {

    // given
    await renderInfo({
      lastRun: mockResult
    });

    // then
    expect(container.querySelector('.crpa-btm-results')).to.exist;
    expect(container.querySelector('.crpa-btm-exec-log')).to.exist;
    expect(container.querySelector('.crpa-btm-vars')).to.exist;

    // TODO: adjust once results are proxied
    // expect(container.querySelector('.crpa-btm-results iframe')).to.exist;
    expect(container.querySelector('.crpa-btm-results pre')).to.exist;
  });


  async function renderInfo(state) {
    const mockEditor = { _state: state, eventBus: { on: NOOP, off: NOOP } };
    mockEditor.getState = () => mockEditor._state;

    await act(() => {
      createRoot(container).render(
        <TestingTab
          editor={ mockEditor }
        />
      );
    });
  }

});