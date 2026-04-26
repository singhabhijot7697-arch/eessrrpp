const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearcases")
    .setDescription("Clear all cases"),

  async execute(i, client) {
    client.cases[i.guild.id] = [];
    i.reply("Cleared");
  }
};