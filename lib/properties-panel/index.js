/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { render } from '@bpmn-io/properties-panel/preact';
import { html } from 'htm/preact';

import { PropertiesPanel, PropertiesPanelContext } from '@bpmn-io/properties-panel';

import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

import general from './groups/general';

import RPAPropertiesContext from './Context/RPAPropertiesContext';

import _debounce from '../utils/debounce';

import icon from './icons/Bot.svg';
const iconDataUrl = `data:image/svg+xml,${encodeURIComponent(icon)}`;


const DEFAULT_LAYOUT = {
  groups: {
    'general': { 'open': true }
  }
};

export function RPAPropertiesPanel({
  element = {},
  layout = {},
  eventBus,
  debounce = _debounce }) {

  const groups = [
    general(element)
  ];

  const headerProvider = {
    getElementLabel: () => {},
    getTypeLabel: () => 'RPA Script',
    getElementIcon: () => () => html`<img class="bio-properties-panel-header-template-icon" width="32" height="32" src=${iconDataUrl}/>`
  };


  return (
    html`<${RPAPropertiesContext.Provider} value=${{ eventBus, debounce }}>
      <${PropertiesPanel} 
        element=${element}
        groups=${groups}
        headerProvider=${headerProvider}
        eventBus=${eventBus}
        layoutConfig=${{ ...DEFAULT_LAYOUT, ...layout }}
      />
    </${PropertiesPanelContext.Provider}>`
  );
}

export default function({ container, ...rest }) {
  render(html`<${RPAPropertiesPanel} ...${rest} />`, container);
}
