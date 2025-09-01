# Project Vorex - Discord Server Manager

A Discord bot with terminal interface for server management operations.

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

The bot will:
1. Show all servers it's in
2. Let you select a server by number
3. Provide 3 commands:
   - Delete all channels and categories
   - Delete all roles
   - Do all of this

## Deploy to Render

1. Push to GitHub
2. Connect repository to Render
3. Set environment variable `DISCORD_TOKEN`
4. Deploy as Python service
