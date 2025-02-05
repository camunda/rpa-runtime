/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import { useEffect, useState } from 'react';

// Check a status and re-check periodically to ensure it is still valid
export default function usePeriodicUpdate(fn, deps, initialValue, intervalDuration = 1000) {
  const [ value, setValue ] = useState(initialValue);

  useEffect(() => {

    // Only have 1 request runing at a time
    let timeout = null;

    const checkValue = async () => {
      const result = await fn();
      if (result !== value) {
        setValue(result);
      }

      timeout = setTimeout(checkValue, intervalDuration);
    };

    checkValue();

    return () => clearTimeout(timeout);
  }, [ ...deps, intervalDuration, value ]);

  return value;
}