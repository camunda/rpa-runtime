/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { createEditor } from './editor/index.js';
import registerHandlers from './handlers/index.js';
import propertiesPanel from './properties-panel';
import { EventBus } from './utils/EventBus.js';

export function RPAEditor({
  container,
  runtimeConfig = {
    host: 'localhost',
    port: 36227
  },
  propertiesPanel: propertiesPanelConfig,
  value,
  onChanged = () => {}
}) {

  // Setup
  const eventBus = new EventBus();

  if (typeof value === 'string') {
    value = JSON.parse(value);
  }

  // Register listeners
  const updateProperty = (key, newValue) => {
    value[key] = newValue;
    eventBus.fire('model.changed', newValue);
  };

  eventBus.on('property.change', ({ key, value }) => {
    updateProperty(key, value);
  });

  eventBus.on('model.changed', (newModel) => {
    onChanged(JSON.stringify(newModel, null, 2));
  });


  // Render
  const editor = createEditor(container,
    {
      eventBus,
      value: value.script,
    }
  );

  const _propertiesPanel = propertiesPanel({
    ...propertiesPanelConfig,
    element: value,
    eventBus
  });

  const instance = {
    editor,
    _state: {},
    propertiesPanel: _propertiesPanel,
    eventBus,
    runtimeConfig
  };

  // Lifecycle events
  instance.getValue = () => {
    return JSON.stringify(value, null, 2);
  };

  instance.destroy = () => {
    editor.dispose();
  };

  instance.setState = (newState) => {
    instance._state = { ...instance._state, ...newState };
    eventBus.fire('state.changed', instance._state);
  };

  instance.getState = () => {
    return instance._state;
  };


  registerHandlers(instance);

  return instance;
}


export * from './testing-tab';