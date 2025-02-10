/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

// Adapted from https://github.com/robotframework/robotframework.github.com/blob/98b11f3f630de01931467f2534d77717ab636f18/src/js/code/editorConfig.js
// original copyright robotframework, licensed under Apache License 2.0.

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import RawLibraries from './Libraries/index.js';

var Libraries = RawLibraries.reduce((acc, curr) => {acc[curr.name] = curr; return acc;}, {});

const Settings = '*** Settings ***';
const TestCases = '*** Test Cases ***';
const Variables = '*** Variables ***';
const Keywords = '*** Keywords ***';
const Comments = '*** Comment ***';
const Tables = [
  Settings,
  TestCases,
  Keywords,
  Comments,
  Variables
];

const SettingsMatcher = /^(?:\* ?)+(?:Settings? ?)(?:\* ?)*(?:(?: {2,}| ?\t| ?\r?$).*)?$/i;
const TestCasesMatcher = /^(?:\* ?)+(?:Test Cases?|Tasks?) ?(?:\* ?)*(?:(?: {2,}| ?\t| ?\r?$).*)?$/i;
const KeywordsMatcher = /^(?:\* ?)+(?:Keywords? ?)(?:\* ?)*(?:(?: {2,}| ?\t| ?\r?$).*)?$/i;
const CommentsMatcher = /^(?:\* ?)+(?:Comments? ?)(?:\* ?)*(?:(?: {2,}| ?\t| ?\r?$).*)?$/i;
const VariablesMatcher = /^(?:\* ?)+(?:Variables? ?)(?:\* ?)*(?:(?: {2,}| ?\t| ?\r?$).*)?$/i;
const KeywordPosMatcher = /(^(?: {2,}| ?\t ?)+(?:(?:\[(?:Setup|Teardown)]|[$&%@]\{.*?\} ?=?)(?: {2,}| ?\t ?))*).*?(?= {2,}| ?\t ?\r?|$)/;

function createKeywordProposals(range, importedLibraries, existingTables) {
  function getKeywordProp(keyword, library, isImported) {
    var args = '';
    var argDoc = '';
    for (const [ i, argument ] of keyword.args.entries()) {
      if (argument.required) {
        args += `    \${${i + 1}:${argument.name}}`;
      }
      argDoc += ` - \`${argument.name}  ${argument.defaultValue ? '= ' + argument.defaultValue : ''}\`\n`;
    }

    const shortDoc = keyword.shortdoc;
    const documentation = keyword.doc;

    const SettingsLines = existingTables[Settings];

    const libraryLocation = isImported ? 0 : (SettingsLines.findLast(({ line }) => line.startsWith('Library')) || SettingsLines[SettingsLines.length - 1]).nr + 1;

    return {
      label: keyword.name,
      detail: library,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: {
        value: `${shortDoc} \n\n**Arguments:**\n` + argDoc + '\n**Documentation:**\n\n' + documentation,
        supportHtml: true
      },
      insertText: keyword.name + args,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
      sortText: isImported ? '0' : '1', // prioritize already imported libraries
      // Move the cursor to the beginning to insert the library, then back to the original position
      additionalTextEdits: isImported ? [] : [ {
        range: {
          startLineNumber: libraryLocation,
          startColumn: 1,
          endLineNumber: libraryLocation,
          endColumn: 1
        },
        text: `Library             ${library}\n`
      } ]
    };
  }

  var proposals = [];
  for (const lib in Libraries) {
    const isImported = importedLibraries.includes(lib) || lib === 'BuiltIn';

    for (const keyword of Libraries[lib].keywords) {
      proposals.push(getKeywordProp(keyword, lib, isImported));
    }
  }

  return proposals;
}

function createTablesProposals(tablesInValue, range) {
  function getTableProp(name) {
    return {
      label: name,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: '',
      insertText: name,
      range: {
        startLineNumber: range.startLineNumber,
        endLineNumber: range.endLineNumber,
        startColumn: 1,
        endColumn: 1
      }
    };
  }

  const propTables = Tables.filter(n => !tablesInValue.includes(n));
  var proposals = [];
  for (const table of propTables) {
    proposals.push(getTableProp(table));
  }
  return proposals;
}

function createSettingsProposals(settingsLines, range) {
  function getSettingsProp(name) {
    return {
      label: name,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: '',
      insertText: name + '    ',
      range: {
        startLineNumber: range.startLineNumber,
        endLineNumber: range.endLineNumber,
        startColumn: 1,
        endColumn: 1
      }
    };
  }
  var existingSettings = [];
  for (const { line } of settingsLines) {
    var matcher = line.match(/^(.*?)(?= {2,}| ?\t ?|$)/);
    if (matcher) {
      existingSettings.push(matcher[1]);
    }
  }

  const propSettings = [
    'Metadata',
    'Library',
    'Resource',
    'Variables'
  ];

  const uniquePropSettings = [
    'Documentation',
    'Suite Setup',
    'Suite Teardown',
    'Test Setup',
    'Test Teardown',
    'Test Template',
    'Test Timeout',
    'Force Tags',
    'Default Tags'
  ];

  const notSetSettings = uniquePropSettings.filter(n => !existingSettings.includes(n));
  var proposals = [];
  for (const setting of [ ...propSettings, ...notSetSettings ]) {
    proposals.push(getSettingsProp(setting));
  }
  return proposals;
}

function createTCKWSettingProposals(range, currentTable, lines) {
  function getTCSKWSettingsProp(name, type) {
    return {
      label: name,
      kind: type,
      documentation: '',
      insertText: name,
      range: range
    };
  }
  var existingSettings = [];
  for (const { line } of lines) {
    var matcher = line.match(/^(?: {2,}| ?\t ?)+(\[(?:Documentation|Template|Tags|Arguments|Setup|Teardown)])(?: {2,}| ?\t ?)*.*?(?= {2,}| ?\t ?|$)/);
    if (matcher) {
      existingSettings.push(matcher[1]);
    }
  }

  const testCaseSettings = [
    '[Documentation]    ',
    '[Tags]    ',
    '[Template]    ',
    '[Setup]    ',
    '[Teardown]    '
  ];

  const keywordSettings = [
    '[Documentation]    ',
    '[Tags]    ',
    '[Arguments]    ',
    '[Teardown]    '
  ];

  const langFeatures = [
    'IF    ',
    'ELSE',
    'ELSE IF    ',
    'FOR    ',
    'END',
    'WHILE    ',
    'RETURN    ',
    'TRY',
    'EXCEPT    ',
    'FINALLY',
    'BREAK',
    'CONTINUE'
  ];

  const settingsList = (currentTable === Keywords) ? keywordSettings : testCaseSettings;
  var proposals = [];
  for (const setting of settingsList.filter(n => !existingSettings.includes(n.trim()))) {
    proposals.push(getTCSKWSettingsProp(setting, monaco.languages.CompletionItemKind.Property));
  }
  for (const statement of langFeatures) {
    proposals.push(getTCSKWSettingsProp(statement, monaco.languages.CompletionItemKind.Keyword));
  }
  return proposals;
}

function getCurrentTable(textLinesUntilPosition) {
  var currentTable = null;
  for (const line of textLinesUntilPosition) {
    if (line) {
      switch (line) {
      case line.match(SettingsMatcher)?.input:
        currentTable = Settings;
        break;
      case line.match(TestCasesMatcher)?.input:
        currentTable = TestCases;
        break;
      case line.match(KeywordsMatcher)?.input:
        currentTable = Keywords;
        break;
      case line.match(CommentsMatcher)?.input:
        currentTable = Comments;
        break;
      case line.match(VariablesMatcher)?.input:
        currentTable = Variables;
        break;
      }
    }
  }
  return currentTable;
}

function getTables(model) {
  const textLines = model.getValue().split('\n');
  var tables = {};
  var currentTable = '';
  for (const [ i, line ] of textLines.entries()) {
    var tableHeader = '';
    switch (line) {
    case line.match(SettingsMatcher)?.input:
      tableHeader = Settings;
      break;
    case line.match(TestCasesMatcher)?.input:
      tableHeader = TestCases;
      break;
    case line.match(KeywordsMatcher)?.input:
      tableHeader = Keywords;
      break;
    case line.match(CommentsMatcher)?.input:
      tableHeader = Comments;
      break;
    case line.match(VariablesMatcher)?.input:
      tableHeader = Variables;
      break;
    }
    if (tableHeader) {
      tables[tableHeader] = [];
      currentTable = tableHeader;
    } else if (currentTable) {
      tables[currentTable].push({ nr: i + 1, line: line });
    }
  }
  return tables;
}

function isAtKeywordPos(currentLine) {
  var isKeywordCall = currentLine.match(KeywordPosMatcher);
  if (isKeywordCall) {
    return (currentLine === isKeywordCall[0]);
  }
}

function getImportedLibraries(settingsTable) {
  var imports = [];
  for (const { line } of settingsTable) {
    var libMatch = line.match(/^(?:Resource(?: {2,}| ?\t ?)+(\w+?)(?:\.resource)?|Library(?: {2,}| ?\t ?)+([\w.]+?)(?:\.py)?)(?: {2,}| ?\t ?|$)+/i);
    if (libMatch) {
      imports.push(libMatch[1] || libMatch[2]);
    }
  }
  return imports;
}

export function getTestCaseRanges(model) {
  const tableContent = getTables(model);
  return (TestCases in tableContent) ? getTestCases(tableContent[TestCases]) : [];
}

function getTestCases(testCaseLines) {
  var testCases = [];
  for (const line of testCaseLines) {
    const isTestCase = line.line.match(/^ ?[^ \t\n\r](.+)$/);
    if (isTestCase) {
      testCases.push({ nr: line.nr, name: line.line.trim() });
    }
  }
  return testCases;
}

monaco.languages.registerCompletionItemProvider('robotframework', {
  provideCompletionItems: (model, position) => {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });
    const textLinesUntilPosition = textUntilPosition.split('\n');
    const currentLine = textLinesUntilPosition.at(-1);



    const currentTable = getCurrentTable(textLinesUntilPosition);

    const tableContent = getTables(model);
    var importedLibraries = (Settings in tableContent) ? getImportedLibraries(tableContent[Settings]) : [];
    const fileName = model.name?.match(/(.*?)\.resource/);
    if (fileName) {
      importedLibraries.push(fileName[1]);
    }
    const existingTables = Object.keys(tableContent);

    const keyword = isAtKeywordPos(currentLine);

    const linestart = currentLine.match(
      /^(?! {2,}| ?\t ?).*/
    );

    if (!keyword && !linestart) {
      return { suggestions: [] };
    }

    if (linestart) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      if (currentTable === Settings) {
        const settingsProp = createSettingsProposals(tableContent[Settings], range);
        const tablesProp = createTablesProposals(existingTables, range);
        return {
          suggestions: [ ...tablesProp, ...settingsProp ]
        };
      } else {
        return {
          suggestions: createTablesProposals(existingTables, range)
        };
      }
    }

    if (keyword && (currentTable === TestCases || currentTable === Keywords)) {
      const kwMatch = model.getValueInRange({
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: 0,
        endColumn: position.column
      }).match(KeywordPosMatcher);
      if (!kwMatch) {
        return { suggestions: [] };
      }

      // const word = model.getWordUntilPosition(position) // TODO: here search for Keyword with spacces not words...
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: kwMatch[1].length + 1,
        endColumn: kwMatch[1].length + 1
      };
      return {
        suggestions: [
          ...createKeywordProposals(range, importedLibraries, tableContent),
          ...createTCKWSettingProposals(range, currentTable, []) // tableContent[currentTable]) // TODO: Analyse keyword content
        ]
      };
    }
  }
});
