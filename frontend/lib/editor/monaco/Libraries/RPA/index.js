/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

// eslint-disable-next-line no-undef
const context = require.context('./', true, /\.json$/);

const allData = context.keys().map(key => context(key));

export default allData;
