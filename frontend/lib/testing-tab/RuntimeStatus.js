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

import './RuntimeStatus.scss';

const RuntimeStatus = ({ editor }) => {
  const {
    runtimeConfig = {
      host: 'localhost',
      port: 36227
    },
    eventBus
  } = editor;

  const [ host, setHost ] = useState(runtimeConfig.host);
  const [ port, setPort ] = useState(runtimeConfig.port);

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

    eventBus.on('config.updated', updateFn);
    return () => eventBus.off('config.updated', updateFn);
  }, [ eventBus, host, port ]);


  useEffect(() => {
    editor.setState({
      runtimeStatus: status
    });
  }, [ status ]);


  return (
    <div className="crpa-runtime-status">
      {status === 'RUNNING' && (<><CheckmarkFilled className="status-icon" fill="green" /> RPA Runtime connected</>)}
      {status === 'ERROR' && (<><ErrorFilled className="status-icon" fill="red" /> RPA Runtime not connected</>)}
    </div>
  );
};

export default RuntimeStatus;