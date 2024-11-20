/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { ScriptReference } from '@carbon/icons-react';
import React from 'react';
import { Grid, Row, Column } from '@carbon/react';


const EmptyState = () => {
  return (
    <Grid fullWidth>
      <Row>
        <Column lg={ { span: 8, offset: 4 } } md={ { span: 6, offset: 2 } } sm={ 4 }>
          <div style={ { textAlign: 'center', padding: '2rem' } }>
            <ScriptReference size={ 64 } />
            <p style={ { marginTop: '1rem' } }>
              Create and run a script or select a run version to see the output here.<br />
              See more information about getting started with Camunda RPA
            </p>
          </div>
        </Column>
      </Row>
    </Grid>
  );
};


const OutputContent = function() {
  return <>
    <EmptyState />
  </>;
};

OutputContent.displayName = 'OutputContent';

export default OutputContent;