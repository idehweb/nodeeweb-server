@echo off

SET "SOURCE=%~1"
SET "DEST=%~2"

DEL /S "%DEST%" && COPY  "%SOURCE%" "%DEST%"
exit "0"