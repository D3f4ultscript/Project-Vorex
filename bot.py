import discord
from discord.ext import commands
import asyncio
import os
from dotenv import load_dotenv

load_dotenv('config.env')

intents = discord.Intents.default()
intents.guilds = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Bot logged in as {bot.user.name}')
    await terminal_interface()

async def terminal_interface():
    while True:
        print("\n=== Discord Bot Terminal Interface ===")
        print("Available servers:")
        
        servers = list(bot.guilds)
        for i, server in enumerate(servers, 1):
            print(f"[{i}] {server.name}")
        
        try:
            choice = input("\nSelect server (number): ")
            server_index = int(choice) - 1
            
            if 0 <= server_index < len(servers):
                selected_server = servers[server_index]
                await server_menu(selected_server)
            else:
                print("Invalid selection!")
        except ValueError:
            print("Please enter a valid number!")
        except KeyboardInterrupt:
            print("\nExiting...")
            break

async def server_menu(server):
    while True:
        print(f"\n=== Server: {server.name} ===")
        print("[1] Delete all Channels and categorys")
        print("[2] Delete all roles")
        print("[0] Back to server selection")
        
        try:
            choice = input("Select action: ")
            
            if choice == "1":
                await delete_all_channels(server)
            elif choice == "2":
                await delete_all_roles(server)
            elif choice == "0":
                break
            else:
                print("Invalid selection!")
        except KeyboardInterrupt:
            break

async def delete_all_channels(server):
    print(f"Deleting all channels and categories in {server.name}...")
    
    for category in server.categories:
        try:
            await category.delete()
            print(f"Deleted category: {category.name}")
        except:
            print(f"Failed to delete category: {category.name}")
    
    for channel in server.channels:
        try:
            await channel.delete()
            print(f"Deleted channel: {channel.name}")
        except:
            print(f"Failed to delete channel: {channel.name}")
    
    print("Channel deletion completed!")

async def delete_all_roles(server):
    print(f"Deleting all roles in {server.name}...")
    
    for role in server.roles:
        if role.name != "@everyone" and role != server.me.top_role:
            try:
                await role.delete()
                print(f"Deleted role: {role.name}")
            except:
                print(f"Failed to delete role: {role.name}")
    
    print("Role deletion completed!")

if __name__ == "__main__":
    token = os.getenv('DISCORD_TOKEN')
    if not token:
        token = input("Enter your Discord bot token: ")
    bot.run(token)
