*** Settings ***
Documentation          Robot to take input and fill in a form
Library                RPA.Browser.Playwright
MetaData    Version    1.0
MetaData    Name       Fills a Form with data from a process Variable

*** Variables ***
&{person}    firstName=John    lastName=Doe    companyName=ACME    role=CEO    address=123 Main St    email=foo@bar.com    phone=1234567890


*** Tasks ***
Complete the challenge
    Start the challenge
    Fill the form
    Collect the results


*** Keywords ***
Start the challenge
    New Browser
    New Page    http://rpachallenge.com/
    Click    button

Fill the form
    Fill Text    //input[@ng-reflect-name="labelFirstName"]    ${person.firstName}
    Fill Text    //input[@ng-reflect-name="labelLastName"]    ${person.lastName}
    Fill Text    //input[@ng-reflect-name="labelCompanyName"]    ${person.companyName}
    Fill Text    //input[@ng-reflect-name="labelRole"]    ${person.role}
    Fill Text    //input[@ng-reflect-name="labelAddress"]    ${person.address}
    Fill Text    //input[@ng-reflect-name="labelEmail"]    ${person.email}
    Fill Text    //input[@ng-reflect-name="labelPhone"]    ${person.phone}

Collect the results
    Take Screenshot  %{ROBOT_ARTIFACTS}${/}result  selector=css=div.inputFields
    Close Browser
