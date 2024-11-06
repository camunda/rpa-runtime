*** Settings ***
Library    Camunda

*** Test Cases ***
Example Test Case
    Set Output Variable    exampleVar    ExampleValue
    Set Output File        exampleFile   /path/to/file
