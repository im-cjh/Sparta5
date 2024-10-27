@echo off
set PROTO_SRC_DIR=.
set PROTO_GEN_DIR=.
set CLIENT_DIR=..\..\Client\Assets

protoc -I=%PROTO_SRC_DIR% --csharp_out=%PROTO_GEN_DIR% %PROTO_SRC_DIR%\Protocol.proto
IF ERRORLEVEL 1 PAUSE


xcopy /Y /E %PROTO_GEN_DIR%\* %CLIENT_DIR%\%PROTO_GEN_DIR%
IF ERRORLEVEL 1 PAUSE
