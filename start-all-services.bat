@echo off
echo Starting Genflow Task Management System...
echo.

REM Start MongoDB if needed
echo Checking MongoDB...
REM mongod --dbpath="C:\data\db" --port 27017

REM Open terminals for each service
echo Starting Main Backend...
start "Main Backend" cmd /k "cd /d e:\Genworx\Genflow-Task-Management\backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting User Management Microservice...
start "User Management Service" cmd /k "cd /d e:\Genworx\Genflow-Task-Management\backend\microservices\user-management && npm start"

timeout /t 3 /nobreak >nul

echo Starting API Gateway...
start "API Gateway" cmd /k "cd /d e:\Genworx\Genflow-Task-Management\api-gateway && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d e:\Genworx\Genflow-Task-Management\frontend && npm start"

echo.
echo All services are starting...
echo.
echo Services will be available at:
echo - Main Backend: http://localhost:5000
echo - User Management: http://localhost:5002
echo - API Gateway: http://localhost:3001
echo - Frontend: http://localhost:4200
echo.
echo Press any key to exit...
pause >nul
