const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setlogs")
    .setDescription("Set log channel")
    .addChannelOption(o =>
      o.setName("channel")
        .setDescription("Channel")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({ content: "❌ Owner only", ephemeral: true });

    const config = client.getConfig(interaction.guild.id);
    config.logChannel = interaction.options.getChannel("channel").id;

    client.saveConfig();

    interaction.reply({ content: "✅ Log channel set", ephemeral: true });
  }
};