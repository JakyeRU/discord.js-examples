@ECHO OFF

copy .env.example .env
npm install && echo Installation successful. Please set your Discord token in .env && (goto) 2>nul & del "%~f0"