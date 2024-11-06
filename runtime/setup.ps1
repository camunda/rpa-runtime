# This script assumes you have PowerShell and that execution of scripts is enabled.
# You can enable script execution by running PowerShell as Administrator and typing:
# Set-ExecutionPolicy RemoteSigned

# Remove the python alias in Windows
Remove-Item $env:LOCALAPPDATA\Microsoft\WindowsApps\python.exe
Remove-Item $env:LOCALAPPDATA\Microsoft\WindowsApps\python3.exe


# Install Python
# Define the download URL
$downloadUrl = "https://github.com/winpython/winpython/releases/download/6.1.20230527/Winpython64-3.10.11.1dot.exe"

# Define the output path
$outputPath = ".\Winpython64-3.10.11.1dot.exe"

# Use WebClient to download WinPython
$webClient = New-Object System.Net.WebClient
$webClient.DownloadFile($downloadUrl, $outputPath)

# Run the installer non-interactively (silent install)
Start-Process -FilePath $outputPath -ArgumentList  "-y" -Wait -NoNewWindow

# Define the path to the portable Python
$pythonPortablePath = "$(Get-Location)\WPy64-310111\python-3.10.11.amd64"

# Add the new directory to the current PATH
$env:PATH += ";$pythonPortablePath;$pythonPortablePath\Scripts;"

# Verify that the directory has been added
Write-Host "Current PATH: $env:PATH"

# Setup virtual environment
& "python.exe" -m venv .venv

& ".venv\Scripts\activate"


# Install Node, required for browser automation
# Define the download URL
$nodeDownloadUrl = "https://nodejs.org/dist/v14.18.1/node-v14.18.1-win-x64.zip"

# Define the output path
$outputPath = ".\node.zip"

# Use WebClient to download Node.js
$webClient = New-Object System.Net.WebClient
$webClient.DownloadFile($nodeDownloadUrl, $outputPath)

# Extract Node.js to a portable location
$extractPath = ".\node"
Expand-Archive -Path $outputPath -DestinationPath $extractPath

# Add Node.js to the PATH
$env:PATH += ";$(Get-Location)\node\node-v14.18.1-win-x64"

# Install npm packages
& "npm" -v

# Install Python requirements using the portable pip
& "pip.exe" install -r requirements.txt --no-deps

# Initialize RF Browser
& "rfbrowser.exe" init

Copy-Item ".\dev.env" -Destination ".\.env"

Write-Host "Installation Done"
