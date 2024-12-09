/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { useState } from 'react';
import { TextArea, Dropdown, Button, Form, Stack, Heading, Section } from '@carbon/react';
import { useUpdateEffect } from '../utils/useUpdateEffect';

const TestRPAScriptForm = ({
  editor = { runnerConfig: {} },
  onSubmit = () => { },
  onChange = () => { }
}) => {

  const {
    defaultVariables = '',
  } = editor.runnerConfig;

  // const [ selectedRunner, setSelectedRunner ] = useState(defaultRunner);
  const [ jsonInput, setJsonInput ] = useState(defaultVariables);

  // useUpdateEffect(() => {
  //   onChange({ runner: selectedRunner, variables: jsonInput });
  // }, [ selectedRunner, jsonInput ]);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateJson()) {
      return;
    }

    onSubmit({ variables: jsonInput });
  };

  const validateJson = () => {
    if (!jsonInput) {
      return true;
    }

    try {
      JSON.parse(jsonInput);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Form className="crpa-run" onSubmit={ handleSubmit }>
      <Section level={ 3 }>
        <Stack gap={ 3 }>
          <Heading>Test Script</Heading>
          <Dropdown
            className="crpa-runner-selection"
            label="RPA Runner"
            titleText="RPA Runner"
            readOnly={ true }
            items={ [ 'Local Runner' ] }
            itemToString={ (item) => (item) }
            selectedItem={ 'Local Runner' }
          />
          <TextArea
            className="crpa-variables"
            labelText="Variables"
            value={ jsonInput }
            invalid={ !validateJson() }
            invalidText="Variables must be valid JSON."
            onChange={ handleJsonChange }
            placeholder={ 'Example: {"orderNumber": "A12BH98", "date": "2020-10-15", "amount": 185.34}' }
            rows={ 3 }
          />
          <Button type="submit">
            Test script
          </Button>
        </Stack>
      </Section>
    </Form>
  );
};


const RunScript = ({ editor, onSubmit = () => {}, onChange = () => {}, ...props }) => {

  const eventBus = editor.eventBus;

  const handleSubmit = (...args) => {
    onSubmit(...args);
    eventBus.fire('script.run', args);
  };

  const handleChange = (...args) => {
    onChange(...args);
    eventBus.fire('runform-changed', args);
  };

  return <TestRPAScriptForm editor={ editor } onSubmit={ handleSubmit } onChange={ handleChange } { ...props } />;

};

export default RunScript;