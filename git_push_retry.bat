@echo off

rem Set project directory
set "PROJECT_DIR=d:\Codes\gitpages\MaRiddleH.github.io"

rem Change to project directory
cd /d "%PROJECT_DIR%"

rem Define maximum retry count
set "MAX_RETRIES=100"

rem Initialize counter
set "RETRY_COUNT=0"

echo Starting git push command, will retry up to %MAX_RETRIES% times on failure...
echo.

:RETRY_LOOP
rem Increment counter
set /a "RETRY_COUNT+=1"

echo Attempt %RETRY_COUNT% of pushing...

rem Execute git push command
git push

rem Check if command succeeded
if %ERRORLEVEL% equ 0 (
    echo.
    echo Push successful!
    goto END
) else (
    echo.
    echo Push failed, retrying...
    echo.
    rem Check if maximum retries reached
    if %RETRY_COUNT% lss %MAX_RETRIES% (
        rem Wait 2 seconds before retrying
        timeout /t 2 /nobreak >nul
        goto RETRY_LOOP
    ) else (
        echo.
        echo After %MAX_RETRIES% attempts, push still failed. Please check network connection and retry manually.
        goto END
    )
)

:END
echo.
echo Script execution completed.
echo Press any key to exit...
pause >nul