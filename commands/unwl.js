const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwl")
    .setDescription("Remove whitelist user or role")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to remove")
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to remove")
    ),

  async execute(i, client) {

    const config = client.getConfig(i.guild.id);

    const user = i.options.getUser("user");
    const role = i.options.getRole("role");

    if (user) config.whitelist = config.whitelist.filter(id => id !== user.id);
    if (role) config.whitelist = config.whitelist.filter(id => id !== role.id);

    i.reply("✅ Removed from whitelist");
  }
};