/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { Launch } from '@carbon/icons-react';
import React, { useEffect, useState } from 'react';
import { Grid, Column, Tile, Heading, Section, CodeSnippet, Tag, SkeletonText, CodeSnippetSkeleton, TagSkeleton, Button, Link, Stack } from '@carbon/react';

import scriptReferenceIcon from './script--reference.svg';

import './DebugInfo.scss';
import useEditorState from '../utils/useEditorState';

const InlineSkeleton = () => {
  return <span className="cds--skeleton__text" style={ {
    display: 'inline-block',
    marginBottom: '-2px',
    width: '20%'
  } } />;
};


const CONNECTED_LABELS = {
  HEADING: 'Create and test RPA script',
  DESCRIPTION: 'Test your script to see the output here.',
  ACTION: 'Test RPA script'
};

const DISCONNECTED_LABELS = {
  HEADING: 'Setup RPA worker',
  DESCRIPTION: 'Setup a local RPA worker to start testing your script.',
  ACTION: 'Connect RPA worker'
};

const EmptyState = ({ editor, eventBus }) => {

  const workerStatus = useEditorState(editor, 'workerStatus');

  const labels = workerStatus === 'RUNNING' ? CONNECTED_LABELS : DISCONNECTED_LABELS;

  const handleClick = () => {
    const eventName = workerStatus === 'RUNNING' ? 'dialog.run.open' : 'dialog.config.open';
    eventBus.fire(eventName);
  };

  return (
    <Section level={ 5 }>
      <div className="crpa-btm-empty">
        <Stack gap={ 4 }>
          <div className="crpa-empty-icon" dangerouslySetInnerHTML={ { __html: scriptReferenceIcon } }></div>
          <Heading>{labels.HEADING}</Heading>
          {labels.DESCRIPTION}
          <Button kind="primary" onClick={ handleClick }>{labels.ACTION}</Button>
          <div>
            <Link href="https://docs.camunda.io/docs/next/components/RPA/getting-started/" target="_blank">Learn more about getting started with Camunda RPA &nbsp;<Launch /></Link>
          </div>
        </Stack>
      </div>
    </Section>
  );
};

const ResultsSkeleton = () => {
  return (
    <div className="cds--content crpa-btm-loading">
      <Section level={ 3 }>
        <Heading>Task Log</Heading>
        <Grid fullWidth>
          <Column lg={ 8 } md={ 4 } sm={ 4 }>
            <Tile>
              <h4>Execution Details</h4>
              <p>Status: <TagSkeleton /></p>
              <p>Last Run: <InlineSkeleton /></p>
              <p>Duration: <InlineSkeleton /></p>
            </Tile>
          </Column>
          <Column lg={ 8 } md={ 4 } sm={ 4 }>
            <Tile>
              <h4>Output Variables</h4>
              <CodeSnippetSkeleton type="multi" />
            </Tile>
          </Column>
        </Grid>
      </Section>

      <Section level={ 3 }>
        <Heading>Execution Details</Heading>
        <Grid fullWidth>
          <Column lg={ 16 } md={ 8 } sm={ 4 }>
            <SkeletonText paragraph={ true } lineCount={ 5 } />
          </Column>
        </Grid>
      </Section>
    </div>
  );
};

const Results = ({ result }) => {
  const { result: status = 'FAILED', startTime, duration, variables, logUrl, log } = result;

  return (
    <div className="cds--content crpa-btm-results">
      <Section level={ 3 }>
        <Heading>Task Log</Heading>
        <Grid fullWidth>
          <Column lg={ 8 } md={ 4 } sm={ 4 }>
            <Tile className="crpa-btm-exec-log">
              <h4>Execution Details</h4>
              <div>Status: <Tag size="sm" type={ status === 'PASS' ? 'green' : 'red' }>{status}</Tag></div>
              <div>Last Run: {startTime}</div>
              <div>Duration: {duration}</div>
            </Tile>
          </Column>
          <Column lg={ 8 } md={ 4 } sm={ 4 }>
            <Tile className="crpa-btm-vars">
              <h4>Output Variables</h4>
              <CodeSnippet type="multi">
                {JSON.stringify(variables, null, 2)}
              </CodeSnippet>
            </Tile>
          </Column>
        </Grid>
      </Section>

      <Section level={ 3 }>
        <Heading>Excecution Details</Heading>
        <Grid fullWidth>
          <Column lg={ 16 } md={ 8 } sm={ 4 }>
            {logUrl ? <iframe
              src={ logUrl }
              style={ { width: '100%', height: '600px', border: 'none' } }
              title="Test Report"
            /> : <pre style={ { width: '100%', height: '600px', border: 'none' } }>
              {log}
            </pre> }


          </Column>
        </Grid>
      </Section>
    </div>
  );
};

const DebugInfo = function({ editor, ...rest }) {
  const state = editor._state;

  const eventBus = editor.eventBus;

  const {
    lastRun,
    scriptRunning
  } = state;

  const [ isLoading, setIsLoading ] = useState(scriptRunning);
  const [ result, setResult ] = useState(lastRun);


  useEffect(() => {
    const handleLoading = () => {
      setIsLoading(true);
    };
    const handleResult = (result) => {
      setResult(result);
      setIsLoading(false);
    };

    eventBus.on('script.run', handleLoading);
    eventBus.on('script.run.result', handleResult);

    return () => {
      eventBus.off('script.run', handleLoading);
      eventBus.off('script.run.result', handleResult);
    };
  }, [ eventBus ]);

  let Component;
  if (isLoading) {
    Component = ResultsSkeleton;
  } else if (result) {
    Component = Results;
  }
  else {
    Component = EmptyState;
  }

  return <div className="crpa-btm">
    <Component editor={ editor } result={ result } eventBus={ eventBus } { ...rest } />
  </div>;
};


export default DebugInfo;