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
      host: 'localhost',
      port: 36227
    },
    eventBus
  } = editor;

  const [ host, setHost ] = useState(workerConfig.host);
  const [ port, setPort ] = useState(workerConfig.port);

  const status = usePeriodicUpdate(async () => {
    try {
      await fetch(`http://${host}:${port}/status`);
      return 'RUNNING';
    } catch (error) {
      return 'ERROR';
    }
  }, [ host, port ], 'ERROR', 1000);

  useEffect(() => {
    const updateFn = (newConfig) => {
      if (newConfig.host !== host) {
        setHost(newConfig.host);
      }

      if (newConfig.port !== port) {
        setPort(newConfig.port);
      }
    };

    eventBus.on('config.changed', updateFn);
    return () => eventBus.off('config.changed', updateFn);
  }, [ eventBus, host, port ]);


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