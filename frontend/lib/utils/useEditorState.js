/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { useEffect, useState } from 'react';

export default function useEditorState(editor, property) {
  const [ state, setState ] = useState(() => {
    const _state = editor.getState(property);
    if (!property) {
      return _state;
    }

    return _state[property];
  });

  const eventBus = editor.eventBus;

  useEffect(() => {
    const cb = newState => {
      if (!property) {
        setState(newState);
      } else {
        setState(newState[property]);
      }
    };

    eventBus.on('state.changed', cb);

    return () => {
      eventBus.off('state.changed', cb);
    };
  }, [ eventBus ]);

  return state;
}
