@echo off
echo Starting The Hideaway MCP Ecosystem...

:: 1. Start the UI Showcase (Port 3001)
echo Starting UI Showcase...
start "Hideaway-UI" cmd /k "node c:\project_backups\the_hideaway_saloon\the_hideaway\mcp-showcase\server.js 3001"

:: 2. Start the Screen Vision Sub-server
echo Starting Screen Vision Sub-server...
start "Claude-Screen" cmd /k "node C:\Users\varun\.gemini\antigravity\claude-screen-mcp\dist\index.js"

:: 3. Start the Unified Gateway (HTTP mode)
echo Starting Unified Gateway (HTTP:8001)...
start "Hideaway-Gateway" cmd /k "C:\Users\varun\.gemini\antigravity\hideaway-tools\.venv\Scripts\python.exe C:\Users\varun\.gemini\antigravity\hideaway-tools\server.py --http --port 8001"

echo.
echo All servers started in separate windows.
echo Gateway available at http://localhost:8001
echo UI Showcase available at http://localhost:3001 (Next.js on 3000)
pause
