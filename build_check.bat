@echo off
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvarsall.bat" x64 >NUL 2>&1
set PATH=%USERPROFILE%\.cargo\bin;%PATH%
cd /d "%~dp0src-tauri"
cargo clean
cargo check 2>&1
