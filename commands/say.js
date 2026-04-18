const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send a message as the bot")
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message to send")
        .setRequired(true)
    ),

  async execute(interaction) {
    const text = interaction.options.getString("text");

    await interaction.reply({ content: "✅ Sent", ephemeral: true });
    interaction.channel.send(text);
  }
};