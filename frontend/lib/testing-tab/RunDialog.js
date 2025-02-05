/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { useEffect, useState } from 'react';
import { TextArea, Dropdown, Button, Form, Stack, Heading, Section } from '@carbon/react';

const TestRPAScriptForm = ({
  editor = { workerConfig: {} },
  onSubmit = () => { },
}) => {

  const {
    variables = '',
  } = editor._state;

  const [ jsonInput, setJsonInput ] = useState(variables);


  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    editor.setState({
      variables: e.target.value
    });
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
            id="crpa-runner-selection"
            className="crpa-runner-selection"
            label="RPA Runner"
            titleText="RPA Runner"
            readOnly={ true }
            items={ [ 'Local Runner' ] }
            itemToString={ (item) => (item) }
            selectedItem={ 'Local Runner' }
          />
          <TextArea
            id="crpa-variables"
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


const RunDialog = ({ editor, onSubmit = () => {}, ...props }) => {


  useEffect(() => {

    // Open Config if no runner is connected
    if (editor._state.workerStatus !== 'RUNNING') {
      onSubmit();
      eventBus.fire('dialog.config.open');
    }
  }, []);

  const eventBus = editor.eventBus;

  const handleSubmit = (options) => {
    onSubmit(options);
    eventBus.fire('script.run', options);
  };


  return <TestRPAScriptForm editor={ editor } onSubmit={ handleSubmit } { ...props } />;
};

export default RunDialog;