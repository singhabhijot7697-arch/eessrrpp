const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wl")
    .setDescription("Whitelist user/role")
    .addUserOption(o => o.setName("user").setDescription("User"))
    .addRoleOption(o => o.setName("role").setDescription("Role")),

  async execute(interaction, client) {

    // ✅ OWNER ONLY
    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.reply({ content: "❌ Only bot owner can use this", ephemeral: true });
    }

    const config = client.getConfig(interaction.guild.id);

    const user = interaction.options.getUser("user");
    const role = interaction.options.getRole("role");

    if (!user && !role) {
      return interaction.reply({ content: "❌ Provide user or role", ephemeral: true });
    }

    if (user) config.whitelist.push(user.id);
    if (role) config.whitelist.push(role.id);

    client.saveConfig();

    interaction.reply({ content: "✅ Added to whitelist", ephemeral: true });
  }
};