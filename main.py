import discord
import asyncio
import os
from config import DISCORD_TOKEN

intents = discord.Intents.default()
intents.guilds = True
intents.members = True

client = discord.Client(intents=intents)

async def delete_all_channels_and_categories(guild):
    for channel in guild.channels:
        try:
            await channel.delete()
            print(f"Deleted: {channel.name}")
        except Exception as e:
            print(f"Failed to delete {channel.name}: {e}")

async def delete_all_roles(guild):
    for role in guild.roles:
        if role.name != "@everyone":
            try:
                await role.delete()
                print(f"Deleted role: {role.name}")
            except Exception as e:
                print(f"Failed to delete role {role.name}: {e}")

async def do_all(guild):
    print("Deleting all channels and categories...")
    await delete_all_channels_and_categories(guild)
    print("Deleting all roles...")
    await delete_all_roles(guild)
    print("All operations completed!")

async def main():
    await client.wait_until_ready()
    
    print("Project Vorex - Discord Server Manager")
    print("=" * 40)
    
    guilds = client.guilds
    if not guilds:
        print("Bot is not in any servers!")
        return
    
    print("Available servers:")
    for i, guild in enumerate(guilds, 1):
        print(f"{i}. {guild.name}")
    
    while True:
        try:
            choice = input("\nSelect server (enter number): ")
            server_index = int(choice) - 1
            
            if 0 <= server_index < len(guilds):
                selected_guild = guilds[server_index]
                print(f"\nSelected: {selected_guild.name}")
                print("\nAvailable commands:")
                print("1. Delete all channels and categories")
                print("2. Delete all roles")
                print("3. Do all of this")
                
                cmd_choice = input("\nSelect command (1-3): ")
                
                if cmd_choice == "1":
                    await delete_all_channels_and_categories(selected_guild)
                elif cmd_choice == "2":
                    await delete_all_roles(selected_guild)
                elif cmd_choice == "3":
                    await do_all(selected_guild)
                else:
                    print("Invalid command!")
                    
                break
            else:
                print("Invalid server number!")
        except ValueError:
            print("Please enter a valid number!")
        except KeyboardInterrupt:
            print("\nExiting...")
            break
    
    await client.close()

@client.event
async def on_ready():
    print(f"Logged in as {client.user}")
    await main()

client.run(DISCORD_TOKEN)
