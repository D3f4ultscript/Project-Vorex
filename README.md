# Project Vorex - Discord Server Manager

A Discord bot with terminal interface for server management operations.

## Latest Versions (September 2025)
- Python: 3.13.7
- discord.py: 2.6.3
- PyInstaller: 6.4.0

## Setup

1. Create a Discord application and bot at https://discord.com/developers/applications
2. Get your bot token
3. Invite the bot to your servers with Administrator permissions
4. Copy `env_example.txt` to `.env` and add your bot token

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python main.py
```

## Build Executable (.exe)

### Windows
```bash
build.bat
```

### Manual
```bash
python build_exe.py
```

The executable will be created in the `dist` folder as `ProjectVorex.exe`.

## Deploy to Render

1. Push to GitHub
2. Connect repository to Render
3. Set environment variables:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
4. Deploy as Python service
