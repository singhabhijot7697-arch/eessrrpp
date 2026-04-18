const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogs")
    .setDescription("Set the log channel for this server")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Select log channel")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const config = client.getConfig(interaction.guild.id);
    config.logChannel = interaction.options.getChannel("channel").id;
    client.saveConfig();

    interaction.reply("✅ Log channel set");
  }
};