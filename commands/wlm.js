const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wlm")
    .setDescription("Add mod whitelist")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to whitelist")
        .setRequired(true)
    ),

  async execute(i, client) {
    const user = i.options.getUser("user");

    if (!client.modWhitelist[i.guild.id]) {
      client.modWhitelist[i.guild.id] = [];
    }

    client.modWhitelist[i.guild.id].push(user.id);

    i.reply("Added to mod whitelist");
  }
};