const fs = require("fs");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeword")
    .setDescription("Remove a banned word")
    .addStringOption(o =>
      o.setName("word")
        .setDescription("Word to remove")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const word = interaction.options.getString("word").toLowerCase();

    client.words = client.words.filter(w => w !== word);
    fs.writeFileSync("./data/words.json", JSON.stringify(client.words, null, 2));

    interaction.reply(`✅ Removed: ${word}`);
  }
};