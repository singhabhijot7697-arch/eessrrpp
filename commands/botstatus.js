const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botstatus")
    .setDescription("Set bot status")
    .addIntegerOption(o =>
      o.setName("type")
        .setDescription("Type (0=playing,2=listening,3=watching)")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Status text")
        .setRequired(true)
    ),

  async execute(i, client) {

    await i.deferReply({ flags: 64 });

    if (i.user.id !== process.env.OWNER_ID)
      return i.editReply("❌ Owner only");

    client.statusList = [
      {
        type: i.options.getInteger("type"),
        text: i.options.getString("text")
      }
    ];

    i.editReply("✅ Status updated");
  }
};