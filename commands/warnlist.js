const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnlist")
    .setDescription("Show warnings")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
        .setRequired(true)
    ),

  async execute(i, client) {
    const user = i.options.getUser("user");

    const warns = client.warns[i.guild.id]?.[user.id] || 0;

    i.reply(`${warns}/5 warnings`);
  }
};