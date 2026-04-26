const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setmodlog")
    .setDescription("Set mod log channel")
    .addChannelOption(o =>
      o.setName("channel")
        .setDescription("Channel")
        .setRequired(true)
    ),

  async execute(i, client) {

    if (i.user.id !== process.env.OWNER_ID)
      return i.reply({ content: "❌ Owner only", ephemeral: true });

    const ch = i.options.getChannel("channel");

    client.setModLog(i.guild.id, ch.id);

    i.reply({ content: "✅ Mod log set", ephemeral: true });
  }
};