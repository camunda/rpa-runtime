#!/bin/bash

# List of packages to re-export
packages=(
  "Archive"
  "Assistant"
  "Browser.Selenium"
  "Browser.Playwright"
  "Calendar"
  "Cloud.AWS"
  "Cloud.Azure"
  "Cloud.Google"
  "Crypto"
  "Database"
  "Desktop"
  "Desktop.Clipboard"
  "Desktop.OperatingSystem"
  "DocumentAI"
  "DocumentAI.Base64AI"
  "DocumentAI.Nanonets"
  "Email.Exchange"
  "Email.ImapSmtp"
  "Excel.Application"
  "Excel.Files"
  "FileSystem"
  "FTP"
  "HTTP"
  "Hubspot"
  "Images"
  "JavaAccessBridge"
  "JSON"
  "MFA"
  "MSGraph"
  "Netsuite"
  "Notifier"
  "OpenAI"
  "Outlook.Application"
  "PDF"
  "Robocorp.Process"
  "Robocorp.WorkItems"
  "Robocorp.Vault"
  "Robocorp.Storage"
  "Salesforce"
  "SAP"
  "Slack"
  "Smartsheet"
  "Tables"
  "Tasks"
  "Twitter"
  "Windows"
  "Word.Application"
)

# Base directory for the re-exported packages
base_dir="re_exported_rpa"

# Create the base directory
mkdir -p "$base_dir"

# Function to create the necessary folder structure and re-export files
create_re_export() {
  local package=$1
  local package_dir="$base_dir/$(echo "$package" | tr '.' '/')"
  mkdir -p "$package_dir"
  echo "from RPA.$package import *" > "$package_dir/__init__.py"
}

# Loop through the list of packages and create the re-export structure
for package in "${packages[@]}"; do
  create_re_export "$package"
done

echo "Re-export structure created successfully in $base_dir"
