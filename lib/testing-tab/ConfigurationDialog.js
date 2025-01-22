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
  Link,
  OrderedList,
  ListItem,
  Section,
  Stack,
  Heading,
} from '@carbon/react';

import { ArrowRight } from '@carbon/icons-react';

import './ConfigurationDialog.scss';

const ConfigurationDialog = ({ editor }) => {

  const { workerConfig = {}, eventBus } = editor;

  const [ host, setHost ] = useState(workerConfig.host || 'localhost');
  const [ port, setPort ] = useState(workerConfig.port || 36227);

  const handlePortChange = (_, { value }) => {
    setPort(value);

    if (validatePort(value)) {
      workerConfig.port = value;
      eventBus.fire('config.changed', workerConfig);
    };
  };

  const handleHostChange = (e) => {
    setHost(e.target.value);

    workerConfig.host = e.target.value;
    eventBus.fire('config.changed', workerConfig);
  };

  return (
    <div className="crpa-Runner-Selection">
      <Section level={ 3 }>
        <Stack gap={ 5 }>
          <Heading>Welcome to Camunda Robotic Process Automation</Heading>

          <Section>
            To begin building RPA scripts in Camunda, you&apos;ll first need to configure
            the RPA worker, which is used to execute automation scripts in RPA
            environments.
          </Section>

          <Section>
            Choose the installation option that works best for you:
            <div className="list-container">
              <OrderedList>
                <ListItem>
                  Download RPA worker and let Camunda handle the setup for you,
                  simple and hassle-free.
                </ListItem>
                <ListItem>
                  Manually download the RPA worker to configure it yourself, giving
                  you full control over the process.
                </ListItem>
              </OrderedList>
            </div>
          </Section>

          <Accordion>
            <AccordionItem title="Additional configurations">
              <Stack gap={ 3 }>
                <p>Define additional configurations for your local RPA worker.</p>
                <TextInput
                  id="crpa-host-input"
                  className="crpa-host-input"
                  labelText="Hostname"
                  value={ host }
                  onChange={ handleHostChange }
                  helperText="Hostname or IP of the machine your RPA worker is running on."
                />

                <NumberInput
                  id="crpa-port-input"
                  className="crpa-port-input"
                  label="Port"
                  min={ 1 }
                  max={ 65535 }
                  invalid={ !validatePort(port) }
                  invalidText="Port must be number between 1 and 65535."
                  value={ port }
                  onChange={ handlePortChange }
                  helperText="Port your RPA worker is listening on."
                />
              </Stack>
            </AccordionItem>
          </Accordion>

          <Section>
            Need more guidance? Check out our{' '}
            {/* TODO: add link to documentation here */}
            <Link href="https://docs.camunda.io/docs/next/components/early-access/experimental/rpa/rpa-integration/#rpa-runtime">getting started guides</Link> for step-by-step
            instructions.
          </Section>

          <div className="button-container">
            <Link href="https://github.com/camunda/rpa-runtime/archive/refs/heads/main.zip" renderIcon={ () => <ArrowRight aria-label="Arrow Right" /> }>
              Download RPA worker
            </Link>
          </div>
        </Stack>
      </Section>
    </div>
  );
};


export default ConfigurationDialog;

// Helpers

const validatePort = (port) => !isNaN(port) && port >= 1 && port <= 65535;
