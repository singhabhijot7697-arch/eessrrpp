const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setverificationpanel")
    .setDescription("Send verification panel")
    .addAttachmentOption(o =>
      o.setName("image")
        .setDescription("Verification image")
    ),

  async execute(i) {
    i.reply("Panel sent");
  }
};