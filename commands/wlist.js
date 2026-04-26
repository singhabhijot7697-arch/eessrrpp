const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wlist")
    .setDescription("Show whitelist"), 

  async execute(i, client) {

    await i.deferReply({ flags: 64 });

    const cfg = client.getConfig(i.guild.id);

    const list = cfg.whitelist || [];

    i.editReply(list.length ? list.map(id => `<@${id}>`).join("\n") : "None");
  }
};