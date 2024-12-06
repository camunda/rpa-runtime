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
import {
  Accordion,
  AccordionItem,
  TextInput,
  NumberInput,
  Button,
  Link,
  OrderedList,
  ListItem,
  Section,
  Stack,
  Heading,
} from '@carbon/react';

import './RunnerSelection.scss';

const CamundaRPAConfig = ({ editor }) => {

  const { runnerConfig = {}, eventBus } = editor;

  const [ location, setLocation ] = useState(runnerConfig.location || 'localhost');
  const [ port, setPort ] = useState(runnerConfig.port || 36227);


  const handlePortChange = (_, { value }) => {
    setPort(value);

    if (validatePort(value)) {
      runnerConfig.port = value;
      eventBus.fire('config.updated', {
        ...runnerConfig,
        port: value
      });
    };
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);

    runnerConfig.location = e.target.value;
    eventBus.fire('config.updated', {
      ...runnerConfig,
      location: e.target.value
    });
  };

  return (
    <div className="crpa-Runner-Selection">
      <Section level={ 3 }>
        <Stack gap={ 5 }>
          <Heading>Welcome to Camunda Robotic Process Automation</Heading>

          <Section>
            To begin building RPA scripts in Camunda, you&apos;ll first need to configure
            the RPA runtime, which is used to execute automation scripts in RPA
            environments.
          </Section>

          <Section>
            Choose the installation option that works best for you:
            <div className="list-container">
              <OrderedList>
                <ListItem>
                  Download RPA Runner and let Camunda handle the setup for you,
                  simple and hassle-free.
                </ListItem>
                <ListItem>
                  Manually download the RPA Runner to configure it yourself, giving
                  you full control over the process.
                </ListItem>
              </OrderedList>
            </div>
          </Section>

          <Accordion>
            <AccordionItem title="Additional configurations">
              <Stack gap={ 3 }>
                <p>Define additional configurations for your local RPA runner.</p>
                <TextInput
                  className="crpa-location-input"
                  labelText="Location"
                  value={ location }
                  onChange={ handleLocationChange }
                  tooltipAlignment="end"
                  helperText="Specify the location of the RPA Runner."
                />

                <NumberInput
                  className="crpa-port-input"
                  label="Port"
                  min={ 1 }
                  max={ 65535 }
                  invalid={ !validatePort(port) }
                  invalidText="Port must be number between 1 and 65535."
                  value={ port }
                  onChange={ handlePortChange }
                  tooltipAlignment="end"
                  helperText="Specify the port for the RPA Runner."
                />
              </Stack>
            </AccordionItem>
          </Accordion>

          <Section>
            Need more guidance? Check out our{' '}
            {/* TODO: add link to documentation here */}
            <Link href="#">getting started guides</Link> for step-by-step
            instructions.
          </Section>

          <div className="button-container">
            {/* TODO: add links */}
            <Button kind="secondary">Manual setup guide</Button>
            <Button kind="primary">Download Camunda RPA Runner</Button>
          </div>
        </Stack>
      </Section>
    </div>
  );
};


export default CamundaRPAConfig;

// Helpers

const validatePort = (port) => !isNaN(port) && port >= 1 && port <= 65535;
