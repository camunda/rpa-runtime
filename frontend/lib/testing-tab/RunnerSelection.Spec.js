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

import RunnerSelection from './RunnerSelection.js';

import '../integration.Spec.scss';

// eslint-disable-next-line no-undef
global.IS_REACT_ACT_ENVIRONMENT = true;

describe('RunnerSelection', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
    container.style.padding = '10px';
  });


  it('should show', async function() {

    // given
    await renderSelection();

    // then
    expect(container.querySelector('.crpa-Runner-Selection')).to.exist;
  });


  it('should update location', async function() {

    // given
    const eventBus = { fire: Sinon.spy() };
    await renderSelection({ editor: { eventBus } });

    const locationInput = container.querySelector('.crpa-location-input input');

    // when
    await act(() => {
      fireEvent.input(locationInput, { target: { value: 'new-location' } });
    });

    // then
    expect(eventBus.fire).to.have.been.calledWith('config.updated', Sinon.match({ location: 'new-location' }));
  });


  it('should update port', async function() {

    // given
    const eventBus = { fire: Sinon.spy() };
    await renderSelection({ editor: { eventBus } });

    const portInput = container.querySelector('.crpa-port-input input');

    // when
    await act(() => {
      fireEvent.change(portInput, { target: { value: '1234' } });
    });

    // then
    expect(eventBus.fire).to.have.been.calledWith('config.updated', Sinon.match({ port: 1234 }));
  });


  it('should validate port', async function() {

    // given
    await renderSelection();
    const portInput = container.querySelector('.crpa-port-input input');

    // assume
    let errorMessage = container.querySelector('.cds--form-requirement');
    expect(errorMessage).not.to.exist;


    // when
    await act(() => {
      fireEvent.change(portInput, { target: { value: '70000' } });
    });

    // then
    errorMessage = container.querySelector('.cds--form-requirement');
    expect(errorMessage).to.exist;
  });


  async function renderSelection(props = { editor: {} }) {
    await act(() => {
      createRoot(container).render(
        <RunnerSelection
          { ...props }
        />
      );
    });
  }

});