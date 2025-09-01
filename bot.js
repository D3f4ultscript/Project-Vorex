const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

const readline = require('readline');

client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
    startTerminal();
});

async function startTerminal() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
        console.log('\n=== Discord Bot Terminal Interface ===');
        console.log('Available servers:');
        
        const servers = Array.from(client.guilds.cache.values());
        servers.forEach((server, index) => {
            console.log(`[${index + 1}] ${server.name}`);
        });

        try {
            const choice = await question(rl, '\nSelect server (number): ');
            const serverIndex = parseInt(choice) - 1;
            
            if (serverIndex >= 0 && serverIndex < servers.length) {
                const selectedServer = servers[serverIndex];
                await serverMenu(rl, selectedServer);
            } else {
                console.log('Invalid selection!');
            }
        } catch (error) {
            if (error.message === 'SIGINT') {
                console.log('\nExiting...');
                process.exit(0);
            }
            console.log('Please enter a valid number!');
        }
    }
}

async function serverMenu(rl, server) {
    while (true) {
        console.log(`\n=== Server: ${server.name} ===`);
        console.log('[1] Delete all Channels and categorys');
        console.log('[2] Delete all roles');
        console.log('[0] Back to server selection');
        
        try {
            const choice = await question(rl, 'Select action: ');
            
            if (choice === '1') {
                await deleteAllChannels(server);
            } else if (choice === '2') {
                await deleteAllRoles(server);
            } else if (choice === '0') {
                break;
            } else {
                console.log('Invalid selection!');
            }
        } catch (error) {
            if (error.message === 'SIGINT') {
                break;
            }
        }
    }
}

async function deleteAllChannels(server) {
    console.log(`Deleting all channels and categories in ${server.name}...`);
    
    try {
        const channels = server.channels.cache;
        const categories = server.channels.cache.filter(ch => ch.type === 4);
        
        for (const [id, category] of categories) {
            try {
                await category.delete();
                console.log(`Deleted category: ${category.name}`);
            } catch (error) {
                console.log(`Failed to delete category: ${category.name}`);
            }
        }
        
        for (const [id, channel] of channels) {
            if (channel.type !== 4) {
                try {
                    await channel.delete();
                    console.log(`Deleted channel: ${channel.name}`);
                } catch (error) {
                    console.log(`Failed to delete channel: ${channel.name}`);
                }
            }
        }
        
        console.log('Channel deletion completed!');
    } catch (error) {
        console.log('Error deleting channels:', error.message);
    }
}

async function deleteAllRoles(server) {
    console.log(`Deleting all roles in ${server.name}...`);
    
    try {
        const roles = server.roles.cache;
        
        for (const [id, role] of roles) {
            if (role.name !== '@everyone' && role.id !== server.ownerId) {
                try {
                    await role.delete();
                    console.log(`Deleted role: ${role.name}`);
                } catch (error) {
                    console.log(`Failed to delete role: ${role.name}`);
                }
            }
        }
        
        console.log('Role deletion completed!');
    } catch (error) {
        console.log('Error deleting roles:', error.message);
    }
}

function question(rl, query) {
    return new Promise((resolve, reject) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
        
        rl.on('SIGINT', () => {
            reject(new Error('SIGINT'));
        });
    });
}

client.login(process.env.DISCORD_TOKEN);
