@echo off
echo === Cleaning node_modules and .next from repo ===

REM 1. Makni node_modules i .next iz indexa (ali ostaju na disku)
git rm -r --cached node_modules .next

REM 2. Dodaj promjene
git add .

REM 3. Commitaj promjene
git commit -m "Remove node_modules and .next from repo, add .gitignore"

REM 4. Pushaj na GitHub
git push -u origin main

echo === Done! Repo cleaned and pushed ===
pause