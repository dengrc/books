@echo off

setlocal enabledelayedexpansion
set DIR=styl
set root=%cd%\styl
set out=css

FOR /R %DIR% %%i IN (.) DO (
set dd=%%i
set "dd=!dd:~0,-1!"
set "p=!dd:%root%=%DIR%!"
set "q=!dd:%root%=%out%!"
md !q!
)

node build.dir.js
pause