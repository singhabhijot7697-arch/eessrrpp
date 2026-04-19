const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send message")
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    const config = client.getConfig(interaction.guild.id);

    const isWhitelisted =
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!isWhitelisted) {
      return interaction.reply({ content: "❌ Not whitelisted", ephemeral: true });
    }

    const text = interaction.options.getString("text");

    await interaction.reply({ content: "✅ Sent", ephemeral: true });
    interaction.channel.send(text);
  }
};