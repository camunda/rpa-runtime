*** Settings ***
Library           BuiltIn

*** Variables ***
${processVariable}    Default Value    # You can set a default value here

*** Test Cases ***
Echo Input Variable
    Log To Console    The input variable is: ${processVariable.bar}
