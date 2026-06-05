@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Sarubbi Retail Watch - Ejecutando

echo ============================================
echo   Relevando precios Sarubbi y competencia
echo ============================================
echo.

if not exist "node_modules" (
    echo [X] La app no esta instalada todavia.
    echo.
    echo Hace doble click primero en INSTALAR.bat
    echo.
    pause
    exit /b 1
)

echo [1/2] Bajando precios de cadenas online y cargas manuales...
echo       Puede tardar varios minutos segun las fuentes disponibles.
echo.
call node src\main.js
if errorlevel 1 goto error

echo.
echo [2/2] Generando PDF...
echo.
call node src\pdf.js
if errorlevel 1 goto error

echo.
echo ============================================
echo   LISTO
echo ============================================
echo.
echo Los archivos quedaron en:  data\output\
echo.
echo Buscas el .csv y el .pdf con la fecha mas reciente.
echo Te abro la carpeta...
echo.

start "" "%~dp0data\output"

timeout /t 3 >nul
exit /b 0

:error
echo.
echo ============================================
echo   ERROR
echo ============================================
echo.
echo Algo fallo durante el scraping. Probables causas:
echo   - Sin conexion a internet
echo   - Algun super esta caido temporalmente
echo   - Algun super te esta bloqueando (espera 5 min y proba de nuevo)
echo.
pause
exit /b 1
