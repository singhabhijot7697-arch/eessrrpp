const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("case")
    .setDescription("View case")
    .addIntegerOption(o =>
      o.setName("id")
        .setDescription("Case ID")
        .setRequired(true)
    ),

  async execute(i, client) {
    const id = i.options.getInteger("id");

    const cases = client.cases[i.guild.id] || [];
    const c = cases.find(x => x.id === id);

    if (!c) return i.reply("Not found");

    i.reply(`#${c.id} ${c.action} - ${c.reason}`);
  }
};