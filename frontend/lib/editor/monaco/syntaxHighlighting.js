/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

monaco.languages.register({ id: 'robotframework' });
monaco.languages.setMonarchTokensProvider('robotframework', {
  defaultToken: 'string',
  tokenPostfix: '.robotframework',
  ignoreCase: false,
  keywords: [
    'IF',
    'END',
    'FOR',
    'IN',
    'IN RANGE',
    'IN ENUMERATE',
    'IN ZIP',
    'ELSE IF',
    'ELSE',
    'TRY',
    'EXCEPT',
    'FINALLY',
    'RETURN',
    'BREAK',
    'CONTINUE'
  ],
  brackets: [
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.bracket' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' }
  ],
  tokenizer: {
    root: [
      { include: '@comment' },
      { include: '@vars' },
      { include: '@tables' },
      { include: '@setting' },
      { include: '@tc_kw_definition' },
      { include: '@keyword' },
      { include: '@numbers' },
      [ /[,:;]/, 'delimiter' ],
      [ /[{}[\]()]/, '@brackets' ]
    ],
    comment: [
      [ /(?: {2,}| ?\t ?)#.*/, 'comment' ],
      [ /^#.*/, 'comment' ]
    ],
    tables: [
      [
        /^(\*+ ?(?:[sS]ettings?|[kK]eywords?|[vV]ariables?|[cC]omments?|[dD]ocumentation|[tT]asks?|[tT]est [cC]ases?)[ *]*)(?= {2,}| ?\t| ?$)/,
        'keyword', '@popall'
      ]
    ],
    setting: [
      [ /^(?: {2,}| ?\t ?)+\[(?:Documentation|Tags|Template|Tags|Arguments)]/, 'tag', '@popall' ],
      [ /^(?: {2,}| ?\t ?)+\[(?:Setup|Teardown)]/, 'tag', '@keywordAssignment' ]
    ],
    tc_kw_definition: [
      [ /^(?! {2,}| ?\t ?).*?(?= {2,}| ?\t ?|$)/, 'type', '@popall' ]
    ],
    constant: [
      [
        /^(?!(?: {2,}| ?\t ?)+(?:(?=[$\\[@&%]|\\.)))(?: {2,}| ?\t ?)+(.*?)(?= {2,}| ?\t ?| ?$)/,
        'constant'
      ]
    ],
    vars: [
      [ /^(?: {2,}| ?\t ?)+[$&%@](?=\{)/, 'delimiter.curly.meta.vars1', '@varBodyAssignment' ],
      [ /^[$&%@](?=\{)/, 'delimiter.curly.meta.vars1', '@varBodyVariables' ],
      [ /[$&%@](?=\{)/, 'delimiter.curly.meta.vars1', '@varBody' ]
    ],
    varBodyVariables: [
      [ /\{/, 'delimiter.curly.meta.varBody2', '@varBody' ],
      [ /\}=?(?= {2,}| ?\t ?| ?$)/, 'delimiter.curly.meta.varBody4', '@popall' ],
      [ /\n| {2}/, 'delimiter.meta.varBody5', '@popall' ]
    ],
    varBodyAssignment: [
      [ /\{/, 'delimiter.curly.meta.varBody2', '@varBody' ],
      [ /\}(?: {2,}| ?\t ?)+[$&%@](?=\{)/, 'delimiter.curly.meta.vars1', '@varBodyAssignment' ],
      [ /\}=?/, 'delimiter.curly.meta.varBody4', '@keywordAssignment' ],
      [ /\n| {2}/, 'delimiter.meta.varBody5', '@popall' ]
    ],
    keywordAssignment: [
      [ / ?=?(?: {2,}| ?\t ?)+[^@$%&]*?(?= {2,}| ?\t ?| ?$)/, 'identifier.keywordassignment1', '@popall' ]
    ],
    varBody: [
      [ /[$&%@](?=\{)/, 'delimiter.curly.meta.varBody1', '@varBody' ],
      [ /\{/, 'delimiter.curly.meta.varBody2', '@varBody' ],
      [ /\}(?=\[)/, 'delimiter.curly.meta.varBody3', '@dictKey' ],
      [ /\}|\]/, 'delimiter.curly.meta.varBody4', '@pop' ],
      [ /\n| {2}/, 'delimiter.meta.varBody5', '@popall' ],
      [ /.*?(?= {2}|[$&%@]\{|\})/, 'variable.meta.varBody5', '@pop' ]
    ],
    dictKey: [
      [ /\[/, 'delimiter.curly.meta.dictKey1' ],
      [ /\]/, 'delimiter.curly.meta.dictKey2', '@popall' ],
      [ /[$&%@](?=\{)/, 'delimiter.curly.meta.dictKey3', '@varBody' ],
      [ /\n| {2}/, 'delimiter.meta.dictKey4', '@popall' ],
      [ /.*?(?= {2}|[$&%@]\{|\])/, 'variable.meta.dictKey4', '@pop' ]
    ],
    keyword: [
      [ /(?: {2,}| ?\t ?)+(IF|END|FOR|IN|IN RANGE|IN ENUMERATE|IN ZIP|ELSE|ELSE IF|TRY|EXCEPT|FINALLY|RETURN|BREAK|WHILE|CONTINUE)(?= {2,}| ?\t ?|$)/, 'keyword', '@popall' ],
      [ /^(?: {2,}| ?\t ?)+[^@$%&]*?(?= {2,}| ?\t ?| ?$)/, 'identifier.keyword1', '@popall' ],
      [ /^(?:(?:(?: {2,}| ?\t ?)(?:[$&@]\{(?:.*?)\}(?: ?=)))*(?: {2,}| ?\t ?))(.+?)(?= {2,}| ?\t ?|$)/, 'identifier.keyword3', '@popall' ]
    ],

    // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
    numbers: [
      [ /-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, 'number.hex' ],
      [ /-?(\d*\.)?\d+([eE][+-]?\d+)?[jJ]?[lL]?/, 'number' ]
    ]
  }
});