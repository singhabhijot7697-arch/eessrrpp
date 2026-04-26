const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rwlm")
    .setDescription("Remove mod whitelist")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to remove")
        .setRequired(true)
    ),

  async execute(i, client) {
    const user = i.options.getUser("user");

    if (!client.modWhitelist[i.guild.id]) {
      client.modWhitelist[i.guild.id] = [];
    }

    client.modWhitelist[i.guild.id] =
      client.modWhitelist[i.guild.id].filter(id => id !== user.id);

    i.reply("Removed");
  }
};