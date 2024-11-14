/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import mochaTestContainerSupport from 'mocha-test-container-support';
import { RPAPropertiesPanel } from '.';
import { cleanup, fireEvent, render } from '@testing-library/preact/pure';
import { html } from 'htm/preact/index.js';
import Sinon from 'sinon';
import { act } from 'preact/test-utils';

describe('PropertiesPanel', function() {

  let container;

  beforeEach(function() {
    container = mochaTestContainerSupport.get(this);
  });

  afterEach(function() {
    return cleanup();
  });


  describe('General', function() {

    describe('Script Name', function() {

      it('should show element name', function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar'
        };

        // when
        const result = renderPropertiesPanel({ element });


        // then
        const input = result.getByLabelText('Name');
        expect(input).to.exist;
        expect(input.value).to.eql('Bar');
      });


      it('should edit element name', async function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar'
        };
        const eventBus = {
          on: () => {},
          off: () => {},
          fire: Sinon.spy()
        };

        const result = renderPropertiesPanel({ element, eventBus });
        const input = result.getByLabelText('Name');


        // when
        await act(() => {
          fireEvent.input(input, { target: { value: 'Baz' } });
        });

        // then
        expect(eventBus.fire).to.have.been.calledWith('property.change', { key: 'name', value: 'Baz' });
        expect(input.value).to.eql('Baz');
      });

    });


    describe('Script ID', function() {

      it('should show element ID', function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar'
        };

        // when
        const result = renderPropertiesPanel({ element });


        // then
        const input = result.getByLabelText('Id');
        expect(input).to.exist;
        expect(input.value).to.eql('Foo');
      });


      it('should edit element id', async function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar'
        };
        const eventBus = {
          on: () => {},
          off: () => {},
          fire: Sinon.spy()
        };

        const result = renderPropertiesPanel({ element, eventBus });
        const input = result.getByLabelText('Id');


        // when
        await act(() => {
          fireEvent.input(input, { target: { value: 'Baz' } });
        });

        // then
        expect(eventBus.fire).to.have.been.calledWith('property.change', { key: 'id', value: 'Baz' });
        expect(input.value).to.eql('Baz');
      });


      it('should validate element id', async function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar'
        };
        const eventBus = {
          on: () => {},
          off: () => {},
          fire: Sinon.spy()
        };

        const result = renderPropertiesPanel({ element, eventBus });
        const input = result.getByLabelText('Id');

        // when
        await act(() => {
          fireEvent.input(input, { target: { value: '*+_ ID' } });
        });

        // then
        expect(eventBus.fire).to.not.have.been.called;
        expect(input.value).to.eql('*+_ ID');
      });

    });


    describe('Version Tag', function() {

      it('should show version Tag', function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar',
          versionTag: '1.0.0'
        };

        // when
        const result = renderPropertiesPanel({ element });


        // then
        const input = result.getByLabelText('Version tag');
        expect(input).to.exist;
        expect(input.value).to.eql('1.0.0');
      });


      it('should edit version Tag', async function() {

        // given
        const element = {
          id: 'Foo',
          name: 'Bar'
        };
        const eventBus = {
          on: () => {},
          off: () => {},
          fire: Sinon.spy()
        };

        const result = renderPropertiesPanel({ element, eventBus });
        const input = result.getByLabelText('Version tag');


        // when
        await act(() => {
          fireEvent.input(input, { target: { value: '2.0.0' } });
        });

        // then
        expect(eventBus.fire).to.have.been.calledWith('property.change', { key: 'versionTag', value: '2.0.0' });
        expect(input.value).to.eql('2.0.0');
      });

    });

  });


  describe('Layout', function() {

    it('should open by default', function() {

      // given
      const element = {
        id: 'Foo',
        name: 'Bar'
      };

      // when
      const result = renderPropertiesPanel({ element });

      // then
      const group = result.getByText('General').closest('.bio-properties-panel-group-header');
      expect(group.classList.contains('open')).to.be.true;
    });


    it('should override default', function() {

      // given
      const element = {
        id: 'Foo',
        name: 'Bar'
      };

      // when
      const result = renderPropertiesPanel({ element, layout: { groups: { general: { open: false } } } });

      // then
      const group = result.getByText('General').closest('.bio-properties-panel-group-header');
      expect(group.classList.contains('open')).to.be.false;
    });
  });

  function renderPropertiesPanel({
    element = {},
    eventBus = {
      on: () => {},
      off: () => {},
      fire: () => {}
    },
    ...rest
  }) {

    return render(
      html`<${RPAPropertiesPanel}
        element=${ element }
        eventBus=${ eventBus }
        debounce=${ (f) => f }
        ...${rest}
      />`,
      {
        container
      }
    );
  }

});
