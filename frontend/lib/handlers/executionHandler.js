/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

const exececutionHandler = (editor) => {

  const { eventBus, runtimeConfig, editor: monaco } = editor;

  eventBus.on('script.run', async ({ variables }) => {
    editor.setState({ scriptRunning: true });

    let mappedResult;

    const startTime = new Date();
    try {

      const runResult = await runFile({
        endpoint: `http://${runtimeConfig.host}:${runtimeConfig.port}/`,
        script: monaco.getValue(),
        variables
      });

      const endDate = new Date();

      mappedResult = {
        startTime: startTime.toISOString(),
        duration: (endDate - startTime) / 1000 + 's',
        status: 'PASS',
        variables: runResult.variables,
        logUrl: 'file://' + runResult.logPath
      };

    } catch (error) {
      const endDate = new Date();

      mappedResult = {
        startTime: startTime.toISOString(),
        duration: (endDate - startTime) / 1000 + 's',
        status: 'FAIL',
        error: error.message
      };
    }

    eventBus.fire('script.run.result', mappedResult);

    editor.setState({
      scriptRunning: false,
      lastRun: mappedResult
    });
  });

};

export { exececutionHandler };


async function runFile({ endpoint, script, variables }) {
  console.log('Running script:', script);
  const body = {
    id: 'foobar',
    script
  };

  if (variables) {
    try {
      const parsedVariables = JSON.parse(variables);
      body.variables = parsedVariables;
    } catch (e) {

      // Run without variables
    }
  }


  const response = await fetch(endpoint + 'run', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });


  return await response.json();
}