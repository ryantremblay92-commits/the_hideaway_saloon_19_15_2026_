# The Hideaway - MCP Server Inventory

This document tracks the locally developed MCP servers and UI backends that need to be running for "The Hideaway" development environment.

## 1. Hideaway Gateway / chuk_mcp_server (Unified MCP Server)
This is the primary entry point for all custom tools. It uses the `chuk-mcp-server` gateway architecture to unify multiple services into a single interface.

- **Location:** `C:\Users\varun\.gemini\antigravity\hideaway-tools`
- **Execution Command (STDIO - Recommended for IDE):**
  ```powershell
  "C:\pinokio\bin\miniconda\Library\bin\uv.exe" run --project "C:\Users\varun\.gemini\antigravity\hideaway-tools" "C:\Users\varun\.gemini\antigravity\hideaway-tools\server.py"
  ```
- **Execution Command (HTTP - For Browser/UI Integration):**
  ```powershell
  "C:\pinokio\bin\miniconda\Library\bin\uv.exe" run --project "C:\Users\varun\.gemini\antigravity\hideaway-tools" "C:\Users\varun\.gemini\antigravity\hideaway-tools\server.py" --http --port 8001
  ```
- **Description:** Unifies the following sub-servers:
  - **Native Tools:** `hello`, `calculate`, `show_hideaway_ui`.
  - **Screen Vision:** Proxies all `screen.*` tools from `claude-screen-mcp`.

## 2. Claude Screen MCP (Vision Sub-server)
This server is managed by the Gateway but can also be run independently.

- **Location:** `C:\Users\varun\.gemini\antigravity\claude-screen-mcp`
- **Execution Command:**
  ```powershell
  node "C:\Users\varun\.gemini\antigravity\claude-screen-mcp\dist\index.js"
  ```
- **Description:** Handles screenshotting, OCR, and screen recording. The Gateway expects this to be running (usually via the startup script) so it can proxy requests.

## 3. MCP Showcase (UI Rendering Backend)
This Node.js server hosts the React UI bundles used by the `show_hideaway_ui` tool.

- **Location:** `c:\project_backups\the_hideaway_saloon\the_hideaway\mcp-showcase`
- **Execution Command:**
  ```powershell
  node "c:\project_backups\the_hideaway_saloon\the_hideaway\mcp-showcase\server.js"
  ```
- **Description:** Serves interactive charts, maps, and dashboards at `http://localhost:3000`.

---

### Startup Script Recommendation
To start all services at once, create a `start_mcp.bat` file in your project root:

```batch
@echo off
echo Starting The Hideaway MCP Ecosystem...

:: 1. Start the UI Showcase (Port 3000)
start "Hideaway-UI" cmd /k "node c:\project_backups\the_hideaway_saloon\the_hideaway\mcp-showcase\server.js"

:: 2. Start the Screen Vision Sub-server (Port 8000)
start "Claude-Screen" cmd /k "node C:\Users\varun\.gemini\antigravity\claude-screen-mcp\dist\index.js"

:: 3. Start the Unified Gateway (STDIO for IDE or HTTP for monitoring)
:: Note: Use --http --port 8001 if you want to inspect it via browser
start "Hideaway-Gateway" cmd /k "C:\pinokio\bin\miniconda\Library\bin\uv.exe" run --project C:\Users\varun\.gemini\antigravity\hideaway-tools C:\Users\varun\.gemini\antigravity\hideaway-tools\server.py
```
