@echo off
echo === Instalacija git-filter-repo i ciscenje repozitorija ===

REM 1. Provjeri gdje je instaliran Git
for /f "delims=" %%i in ('where git') do set GIT_PATH=%%i
set GIT_CORE=%GIT_PATH:\bin\git.exe=%
set GIT_CORE=%GIT_CORE%\mingw64\libexec\git-core

echo Git core folder: %GIT_CORE%

REM 2. Skini git-filter-repo skriptu
echo Skidam git-filter-repo...
powershell -Command "Invoke-WebRequest -Uri https://raw.githubusercontent.com/newren/git-filter-repo/main/git-filter-repo -OutFile git-filter-repo"

REM 3. Kopiraj u Git folder
echo Kopiram git-filter-repo u %GIT_CORE% ...
copy /Y git-filter-repo "%GIT_CORE%\git-filter-repo" >nul

REM 4. Provjeri instalaciju
echo Provjeravam instalaciju...
git filter-repo --help >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [GRESKA] git-filter-repo nije ispravno instaliran.
    pause
    exit /b 1
)

echo [OK] git-filter-repo je instaliran!

REM 5. Pokreni ciscenje u frontend projektu
cd frontend
echo Cistim node_modules i .next iz repozitorija...
git filter-repo --path node_modules --path .next --invert-paths

REM 6. Pushaj promjene
echo Pusham promjene na GitHub...
git push origin main --force

echo === Gotovo! Repo je ociscen i pushan ===
pause