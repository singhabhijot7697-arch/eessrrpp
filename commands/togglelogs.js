const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("togglelogs")
    .setDescription("Enable or disable logs"),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({ content: "❌ Owner only", ephemeral: true });

    const config = client.getConfig(interaction.guild.id);

    config.logsEnabled = !config.logsEnabled;
    client.saveConfig();

    interaction.reply({
      content: `✅ Logs are now ${config.logsEnabled ? "ENABLED" : "DISABLED"}`,
      ephemeral: true
    });
  }
};