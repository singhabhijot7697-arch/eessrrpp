const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwl")
    .setDescription("Remove from whitelist")
    .addUserOption(o => o.setName("user").setDescription("User"))
    .addRoleOption(o => o.setName("role").setDescription("Role")),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({ content: "❌ Only bot owner can use this", ephemeral: true });
    }

    const config = client.getConfig(interaction.guild.id);

    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");

    if (user) config.whitelist = config.whitelist.filter(id => id !== user.id);
    if (role) config.whitelist = config.whitelist.filter(id => id !== role.id);

    client.saveConfig();

    interaction.reply({ content: "✅ Removed from whitelist", ephemeral: true });
  }
};