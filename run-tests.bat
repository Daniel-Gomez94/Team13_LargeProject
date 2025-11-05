@echo off
REM UCF Coding Practice - Test Runner Script (Windows)
REM This script helps run tests with various options

setlocal enabledelayedexpansion

echo.
echo ========================================
echo UCF Coding Practice Test Suite
echo ========================================
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo [ERROR] package.json not found!
    echo Please run this script from the project root directory.
    exit /b 1
)

REM Parse command
set COMMAND=%1
if "%COMMAND%"=="" set COMMAND=all
set OPTION=%2

REM Execute based on command
if "%COMMAND%"=="all" goto run_all
if "%COMMAND%"=="frontend" goto run_frontend
if "%COMMAND%"=="backend" goto run_backend
if "%COMMAND%"=="coverage" goto run_coverage
if "%COMMAND%"=="install" goto install_deps
if "%COMMAND%"=="help" goto show_help
if "%COMMAND%"=="--help" goto show_help
if "%COMMAND%"=="-h" goto show_help

echo [ERROR] Unknown command: %COMMAND%
goto show_help

:run_all
echo.
echo [Running All Tests]
echo.
call :run_frontend_tests %OPTION%
call :run_backend_tests %OPTION%
echo.
echo [SUCCESS] All tests completed!
goto end

:run_frontend
echo.
echo [Running Frontend Tests]
echo.
call :run_frontend_tests %OPTION%
goto end

:run_backend
echo.
echo [Running Backend Tests]
echo.
call :run_backend_tests %OPTION%
goto end

:run_coverage
echo.
echo [Running All Tests with Coverage]
echo.
call :run_frontend_tests coverage
call :run_backend_tests coverage
echo.
echo [Coverage Reports]
echo Frontend: frontend\coverage\index.html
echo Backend: backend\coverage\index.html
goto end

:install_deps
echo.
echo [Installing Dependencies]
echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo.
echo [SUCCESS] All dependencies installed!
goto end

:show_help
echo.
echo Usage: run-tests.bat [command] [options]
echo.
echo Commands:
echo   all              Run all tests (default)
echo   frontend         Run frontend tests only
echo   backend          Run backend tests only
echo   install          Install all dependencies
echo   coverage         Run tests with coverage
echo   help             Show this help message
echo.
echo Options:
echo   watch            Run tests in watch mode
echo   ui               Run frontend tests with UI
echo.
echo Examples:
echo   run-tests.bat                    REM Run all tests
echo   run-tests.bat frontend           REM Run frontend tests
echo   run-tests.bat frontend watch     REM Run frontend tests in watch mode
echo   run-tests.bat coverage           REM Run all tests with coverage
echo   run-tests.bat frontend ui        REM Run frontend tests with UI
echo   run-tests.bat install            REM Install dependencies
echo.
goto end

REM Functions

:run_frontend_tests
cd frontend
if "%~1"=="watch" (
    call npm run test:watch
) else if "%~1"=="coverage" (
    call npm run test:coverage
) else if "%~1"=="ui" (
    call npm run test:ui
) else (
    call npm test -- --run
)
cd ..
goto :eof

:run_backend_tests
cd backend
if "%~1"=="watch" (
    call npm run test:watch
) else if "%~1"=="coverage" (
    call npm run test:coverage
) else (
    call npm test
)
cd ..
goto :eof

:end
echo.
endlocal
