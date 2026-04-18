const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwl")
    .setDescription("Remove user or role from whitelist")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to remove")
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to remove")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // ✅ admin only

  async execute(interaction, client) {

    const config = client.getConfig(interaction.guild.id);

    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");

    if (!user && !role)
      return interaction.reply({ content: "❌ Provide user or role", ephemeral: true });

    let removed = false;

    if (user) {
      config.whitelist = config.whitelist.filter(id => id !== user.id);
      removed = true;
    }

    if (role) {
      config.whitelist = config.whitelist.filter(id => id !== role.id);
      removed = true;
    }

    client.saveConfig();

    if (!removed) {
      return interaction.reply({ content: "❌ Not found in whitelist", ephemeral: true });
    }

    interaction.reply({ content: "✅ Removed from whitelist", ephemeral: true });
  }
};