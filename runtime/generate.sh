#!/bin/bash

# Define the location of the libdoc.py script
LIBDOC_PATH=".venv/lib/python3.10/site-packages/robot/libdoc.py"

# Define the output directory
OUTPUT_DIR="./library_docs"

# Create the output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

export PYTHONPATH=".:$PYTHONPATH"

# Function to generate documentation for a library
generate_doc() {
  local package_name=$1
  local output_file="$OUTPUT_DIR/$2"
  python3 $LIBDOC_PATH $package_name $output_file
}

# Generate documentation for each library
generate_doc "Camunda.Archive" "Archive.json"
generate_doc "Camunda.Assistant" "Assistant.json"
generate_doc "Camunda.Browser.Selenium" "Browser.Selenium.json"
# For Browser.Playwright, additional steps may be needed as indicated by "special (more below)"
# Placeholder for additional steps for Browser.Playwright
generate_doc "Camunda.Calendar" "Calendar.json"
generate_doc "Camunda.Desktop" "Desktop.json"
generate_doc "Camunda.Desktop.Clipboard" "Desktop.Clipboard.json"
generate_doc "Camunda.Desktop.OperatingSystem" "Desktop.OperatingSystem.json"
generate_doc "Camunda.Excel.Application" "Excel.Application.json"
generate_doc "Camunda.Excel.Files" "Excel.Files.json"
generate_doc "Camunda.FileSystem" "FileSystem.json"
generate_doc "Camunda.FTP" "FTP.json"
generate_doc "Camunda.HTTP" "HTTP.json"
generate_doc "Camunda.Images" "Images.json"
generate_doc "Camunda.JavaAccessBridge" "JavaAccessBridge.json"
generate_doc "Camunda.JSON" "JSON.json"
generate_doc "Camunda.MFA" "MFA.json"
generate_doc "Camunda.Outlook.Application" "Outlook.Application.json"
generate_doc "Camunda.PDF" "PDF.json"
generate_doc "Camunda.SAP" "SAP.json"
generate_doc "Camunda.Tables" "Tables.json"
generate_doc "Camunda.Tasks" "Tasks.json"
generate_doc "Camunda.Windows" "Windows.json"
generate_doc "Camunda.Word.Application" "Word.Application.json"
