const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Remove warnings from a user")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({ content: "❌ Owner only", ephemeral: true });

    const user = interaction.options.getUser("user");
    const gid = interaction.guild.id;

    if (client.warns[gid] && client.warns[gid][user.id]) {
      delete client.warns[gid][user.id];
      return interaction.reply({ content: `✅ Warnings cleared for ${user.tag}`, ephemeral: true });
    }

    interaction.reply({ content: "❌ No warnings found", ephemeral: true });
  }
};