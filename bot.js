const { Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

client.once('ready', () => {
    console.log('Bot is online!');
});

const msgCommand = new SlashCommandBuilder()
    .setName('msg')
    .setDescription('Send a DM to a server member')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('The user to send a DM to')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('message')
            .setDescription('The message to send')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages);

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'msg') {
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        try {
            await user.send(message);
            await interaction.reply({ content: `Message sent to ${user.tag}`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Failed to send message. User may have DMs disabled.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
