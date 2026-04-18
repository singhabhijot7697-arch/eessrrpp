const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wl")
    .setDescription("Whitelist a user or role")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to whitelist")
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to whitelist")
    ),

  async execute(interaction, client) {
    const config = client.getConfig(interaction.guild.id);

    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");

    if (!user && !role)
      return interaction.reply("❌ Provide user or role");

    if (user) config.whitelist.push(user.id);
    if (role) config.whitelist.push(role.id);

    client.saveConfig();
    interaction.reply("✅ Added to whitelist");
  }
};