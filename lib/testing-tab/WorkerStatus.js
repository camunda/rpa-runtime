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
import { CheckmarkFilled, ErrorFilled } from '@carbon/icons-react';

import usePeriodicUpdate from '../utils/usePeriodicUpdate';

import './WorkerStatus.scss';

const WorkerStatus = ({ editor }) => {
  const {
    workerConfig = {
      baseUrl: 'http://localhost:36227',
    },
    eventBus
  } = editor;

  const [ baseUrl, setBaseUrl ] = useState(workerConfig.baseUrl);

  const status = usePeriodicUpdate(async () => {
    try {
      const result = await fetch(`${workerConfig.baseUrl}actuator/health`);

      if (!result.ok) {
        return 'ERROR';
      }
      return 'RUNNING';
    } catch (error) {
      return 'ERROR';
    }
  }, [ workerConfig.baseUrl ], 'ERROR', 1000);

  useEffect(() => {
    const updateFn = (newConfig) => {
      if (newConfig.baseUrl !== baseUrl) {
        setBaseUrl(newConfig.baseUrl);
      }
    };

    eventBus.on('config.changed', updateFn);
    return () => eventBus.off('config.changed', updateFn);
  }, [ eventBus, baseUrl ]);


  useEffect(() => {
    editor.setState({
      workerStatus: status
    });
  }, [ status ]);


  return (
    <div className="crpa-worker-status">
      {status === 'RUNNING' && (<><CheckmarkFilled className="status-icon" fill="green" /> RPA worker connected</>)}
      {status === 'ERROR' && (<><ErrorFilled className="status-icon" fill="red" /> RPA worker not connected</>)}
    </div>
  );
};

export default WorkerStatus;