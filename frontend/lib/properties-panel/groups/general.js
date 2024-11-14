/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { isTextFieldEntryEdited, TextFieldEntry } from '@bpmn-io/properties-panel';
import { html } from 'htm/preact/index.js';
import { useContext } from '@bpmn-io/properties-panel/preact/hooks';
import RPAPropertiesContext from '../Context/RPAPropertiesContext';
import { isIdValid } from '../../utils/validation';


const NameEntry = ({ element, id, }) => {
  const { eventBus, debounce } = useContext(RPAPropertiesContext);

  const getValue = () => {
    return element.name || '';
  };
  const setValue = (newValue) => {
    eventBus.fire('property.change', {
      key: 'name',
      value: newValue
    });
  };

  return html`<${TextFieldEntry} 
    id=${id}
    getValue=${getValue}
    setValue=${setValue}
    label='Name'
    debounce=${debounce}
  />`;
};


const IdEntry = ({ element, id, }) => {

  const { eventBus, debounce } = useContext(RPAPropertiesContext);

  const getValue = () => {
    return element.id || '';
  };

  const setValue = (newValue, invalid) => {
    if (invalid) {
      return;
    }

    eventBus.fire('property.change', {
      key: 'id',
      value: newValue
    });
  };

  const validate = (value) => {
    return isIdValid(value);
  };

  return html`<${TextFieldEntry} 
    id=${id}
    getValue=${getValue}
    setValue=${setValue}
    validate=${validate}
    label='Id'
    debounce=${debounce}
  />`;
};


const VersionTagEntry = ({ element, id, }) => {
  const { eventBus, debounce } = useContext(RPAPropertiesContext);

  const getValue = () => {
    return element.versionTag || '';
  };
  const setValue = (newValue) => {
    eventBus.fire('property.change', {
      key: 'versionTag',
      value: newValue
    });
  };

  return html`<${TextFieldEntry} 
    id=${id}
    getValue=${getValue}
    setValue=${setValue}
    label='Version tag'
    tooltip='Version tag by which this script can be referenced.'
    debounce=${debounce}
  />`;
};

export default element => {
  const entries = [
    {
      id: 'script-name',
      component: NameEntry,
      element: element,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'script-id',
      component: IdEntry,
      element: element,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'version-tag',
      component: VersionTagEntry,
      element: element,
      isEdited: isTextFieldEntryEdited
    }
  ];

  return ({
    id: 'general',
    label: 'General',
    entries: entries
  });
};