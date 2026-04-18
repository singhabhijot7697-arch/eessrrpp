const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Send a DM to a user")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to DM")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message content")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("text");

    await user.send(text).catch(()=>{});
    interaction.reply("✅ DM sent");
  }
};