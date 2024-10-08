# This script assumes you have PowerShell and that execution of scripts is enabled.
# You can enable script execution by running PowerShell as Administrator and typing:
# Set-ExecutionPolicy RemoteSigned

# Remove the python alias in Windows
Remove-Item $env:LOCALAPPDATA\Microsoft\WindowsApps\python.exe
Remove-Item $env:LOCALAPPDATA\Microsoft\WindowsApps\python3.exe

& ".venv\Scripts\activate"
& "python.exe" -u worker.py
