const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wl")
    .setDescription("Whitelist user or role")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to whitelist")
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to whitelist")
    ),

  async execute(i, client) {

    const config = client.getConfig(i.guild.id);

    const user = i.options.getUser("user");
    const role = i.options.getRole("role");

    if (user) config.whitelist.push(user.id);
    if (role) config.whitelist.push(role.id);

    i.reply("✅ Added to whitelist");
  }
};