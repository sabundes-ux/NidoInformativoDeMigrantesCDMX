@echo off
setlocal enabledelayedexpansion
set todo=%1
for /f "usebackq delims=" %%L in ("%todo%") do (
  set line=%%L
  if "!line:~0,9!"=="pick 78795" (
    echo edit 78795d9 !line:~10!
  ) else if "!line:~0,9!"=="pick 0d57ff2" (
    echo edit 0d57ff2 !line:~10!
  ) else (
    echo !line!
  )
) > "%todo%.new"
move /Y "%todo%.new" "%todo%" >nul
endlocal
