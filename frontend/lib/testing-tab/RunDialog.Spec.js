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

import RunScript from './RunDialog.js';
import Sinon from 'sinon';
import { fireEvent } from '@testing-library/preact';

// eslint-disable-next-line no-undef
global.IS_REACT_ACT_ENVIRONMENT = true;

describe('Run', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  it('should show', async function() {

    // given
    await renderRun({ editor: {} });

    // then
    expect(container.querySelector('.crpa-run')).to.exist;
  });


  it('should validate JSON', async function() {

    // given
    await renderRun();

    const variablesInput = container.querySelector('.crpa-variables textarea');

    // assume
    let errorMessage = container.querySelector('.cds--form-requirement');
    expect(errorMessage).to.not.exist;

    // when
    await act(() => {
      fireEvent.input(variablesInput, { target: { value: '{ "foo": "' } });
    });

    // then
    errorMessage = container.querySelector('.cds--form-requirement');
    expect(errorMessage).to.exist;
  });


  it('should not submit invalid', async function() {

    // given
    const runners = [
      { id: 'runner-1', label: 'Runner 1' },
      { id: 'runner-2', label: 'Runner 2' }
    ];

    const onSubmit = Sinon.spy();

    await renderRun({ editor: { workerConfig: { runners: runners } }, onSubmit });

    const variablesInput = container.querySelector('.crpa-variables textarea');

    await act(() => {
      fireEvent.input(variablesInput, { target: { value: '{ "foo": "' } });
    });

    // assume
    const errorMessage = container.querySelector('.cds--form-requirement');
    expect(errorMessage).to.exist;

    // when
    const submitButton = container.querySelector('button[type="submit"]');
    await act(() => {
      submitButton.click();
    });

    // then
    expect(onSubmit).not.to.have.been.called;

  });


  it('should submit valid', async function() {

    // given
    const onSubmit = Sinon.spy();

    await renderRun({ editor: { workerConfig: { } }, onSubmit });

    const variablesInput = container.querySelector('.crpa-variables textarea');

    await act(() => {
      fireEvent.input(variablesInput, { target: { value: '{ "foo": "bar" }' } });
    });

    // when
    const submitButton = container.querySelector('button[type="submit"]');
    await act(() => {
      submitButton.click();
    });

    // then
    expect(onSubmit).to.have.been.calledOnce;
    expect(onSubmit).to.have.been.calledWith({ variables: '{ "foo": "bar" }' });
  });


  it('should show defaults', async function() {

    // given
    const defaultVariables = '{ "default": "value" }';

    // when
    await renderRun({
      editor: {
        _state: { variables: defaultVariables }
      } }
    );

    // then
    const variablesInput = container.querySelector('.crpa-variables textarea');
    expect(variablesInput.value).to.equal(defaultVariables);
  });


  describe.skip('runner selection', function() {

    it('should notify on change', async function() {

      // given
      const runners = [
        { id: 'runner-1', label: 'Runner 1' },
        { id: 'runner-2', label: 'Runner 2' }
      ];

      const onChange = Sinon.spy();

      await renderRun({ editor: { workerConfig: { runners } }, onChange });

      const variablesInput = container.querySelector('.crpa-variables textarea');
      const dropdown = container.querySelector('.crpa-runner-selection');

      await act(() => {
        dropdown.querySelector('button').click();
      });

      const options = dropdown.querySelectorAll('ul > li');

      // when
      await act(() => {
        options[1].click();
      });

      await act(() => {
        fireEvent.input(variablesInput, { target: { value: '{ "foo": "bar" }' } });

        dropdown.querySelector('button').click();
      });

      // then
      expect(onChange).to.have.been.calledTwice;
      expect(onChange).to.have.been.calledWith({ runner: runners[1], variables: '{ "foo": "bar" }' });
    });


    it('should allow runner selection', async function() {

      // given
      const runners = [
        { id: 'runner-1', label: 'Runner 1' },
        { id: 'runner-2', label: 'Runner 2' }
      ];

      const onSubmit = Sinon.spy();

      await renderRun({ editor: { workerConfig: { runners: runners } }, onSubmit });

      const dropdown = container.querySelector('.crpa-runner-selection');
      const submitButton = container.querySelector('button[type="submit"]');

      await act(() => {
        dropdown.querySelector('button').click();
      });

      const options = dropdown.querySelectorAll('ul > li');

      // assume
      expect(dropdown).to.exist;
      expect([ ...options ]).to.have.length(2);

      // when
      await act(() => {
        options[1].click();
      });

      await act(() => {
        submitButton.click();
      });

      // then
      expect(onSubmit).to.have.been.called;
      expect(onSubmit).to.have.been.calledWith({ runner: runners[1], variables: '' });
    });
  });


  async function renderRun(props = {}) {
    props.editor = {
      _state: { workerStatus: 'RUNNING' },
      setState: Sinon.spy(),
      eventBus: { fire: Sinon.spy() },
      workerConfig: {},
      ...props.editor
    };

    await act(() => {
      createRoot(container).render(
        <RunScript
          { ...props }
        />
      );
    });
  }

});