# Discord MSG Bot

Simple Discord bot that allows sending DMs to server members using the `/msg` command.

## Setup

1. Create a Discord application at https://discord.com/developers/applications
2. Create a bot and copy the token
3. Invite the bot to your server with necessary permissions

## Environment Variables (Render Secrets)

- `DISCORD_TOKEN`: Your bot token from Discord Developer Portal
- `CLIENT_ID`: Your application client ID from Discord Developer Portal

## Commands

- `/msg <user> <message>` - Send a DM to a specified user

## Deployment on Render

1. Connect your GitHub repository to Render
2. Add secrets in Render dashboard:
   - `DISCORD_TOKEN`: Your bot token
   - `CLIENT_ID`: Your application client ID
3. Deploy as a Web Service
