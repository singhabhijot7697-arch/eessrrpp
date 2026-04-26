const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wlmlist")
    .setDescription("Show mod whitelist"),

  async execute(interaction, client) {

    await interaction.deferReply({ flags: 64 });

    const list = client.modWhitelist[interaction.guild.id] || [];

    if (!list.length) {
      return interaction.editReply("No mod whitelist");
    }

    const text = list.map(id => `<@${id}>`).join("\n");

    interaction.editReply(text);
  }
};