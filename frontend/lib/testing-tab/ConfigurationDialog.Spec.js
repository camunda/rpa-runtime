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
import { fireEvent } from '@testing-library/preact';

import RunnerSelection from './ConfigurationDialog.js';

import '../integration.Spec.scss';

// eslint-disable-next-line no-undef
global.IS_REACT_ACT_ENVIRONMENT = true;

describe('ConfigurationDialog', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
    container.style.padding = '10px';
  });


  it('should show', async function() {

    // given
    await renderDialog();

    // then
    expect(container.querySelector('.crpa-Runner-Selection')).to.exist;
  });


  it('should update baseURL', async function() {

    // given
    const eventBus = { fire: Sinon.spy() };
    await renderDialog({ editor: { eventBus } });

    const baseUrlInput = container.querySelector('.crpa-host-input input');

    // when
    await act(() => {
      fireEvent.input(baseUrlInput, { target: { value: 'http://example.com/' } });
    });

    // then
    expect(eventBus.fire).to.have.been.calledWith('config.changed', Sinon.match({ baseUrl: 'http://example.com/' }));
  });


  async function renderDialog(props = { editor: {} }) {
    await act(() => {
      createRoot(container).render(
        <RunnerSelection
          { ...props }
        />
      );
    });
  }

});