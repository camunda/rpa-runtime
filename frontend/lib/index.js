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
import propertiesPanel from './properties-panel';
import { EventBus } from './utils/EventBus.js';

export function RPAEditor({
  container,
  propertiesPanel: propertiesPanelConfig,
  rpaFile,
  onChanged = () => {}
}) {

  // Setup
  const eventBus = new EventBus();

  if (typeof rpaFile === 'string') {
    rpaFile = JSON.parse(rpaFile);
  }

  // Register listeners
  const updateProperty = (key, value) => {
    rpaFile[key] = value;
    eventBus.fire('model.changed', rpaFile);
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
      value: rpaFile.script,
    }
  );

  const _propertiesPanel = propertiesPanel({
    ...propertiesPanelConfig,
    element: rpaFile,
    eventBus
  });

  return {
    editor, propertiesPanel: _propertiesPanel, eventBus
  };
}
