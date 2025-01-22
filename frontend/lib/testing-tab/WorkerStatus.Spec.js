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
import Sinon from 'sinon';
import { expect } from 'chai';

import WorkerStatus from './WorkerStatus.js';

const NOOP = () => {};

const EVENTBUS_MOCK = {
  on: () => {},
  off: () => {},
};

// eslint-disable-next-line no-undef
global.IS_REACT_ACT_ENVIRONMENT = true;

describe('workerStatus', function() {

  let container;
  let fetchStub;

  beforeEach(function() {
    container = TestContainer.get(this);
    // eslint-disable-next-line no-undef
    fetchStub = Sinon.stub(global, 'fetch');
  });

  afterEach(function() {
    fetchStub.restore();
  });


  it('should show running status', async function() {

    // given
    const eventBus = EVENTBUS_MOCK;
    const workerConfig = { host: 'localhost', port: 36227 };

    fetchStub.resolves(new Response(null, { status: 200 }));

    await renderStatus({ editor: { eventBus, _state: { workerConfig }, setState: NOOP } });


    // then
    expect(container.querySelector('.crpa-worker-status')).to.exist;
    expect(container.querySelector('.crpa-worker-status').textContent).to.include('RPA worker connected');
  });


  it('should show error status', async function() {

    // given
    const eventBus = EVENTBUS_MOCK;
    const workerConfig = { host: 'localhost', port: 36227 };

    fetchStub.rejects(new Error('Network Error'));

    await renderStatus({ editor: { eventBus, _state: { workerConfig }, setState: NOOP } });

    // then
    expect(container.querySelector('.crpa-worker-status')).to.exist;
    expect(container.querySelector('.crpa-worker-status').textContent).to.include('RPA worker not connected');
  });


  async function renderStatus(props) {
    await act(() => {
      createRoot(container).render(
        <WorkerStatus
          { ...props }
        />
      );
    });
  }

});