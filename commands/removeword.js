const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeword")
    .setDescription("Remove blocked word")
    .addStringOption(o =>
      o.setName("word")
        .setDescription("Word to remove")
        .setRequired(true)
    ),

  async execute(i, client) {

    const word = i.options.getString("word").toLowerCase();

    client.words = client.words.filter(w => w !== word);

    fs.writeFileSync("./data/words.json", JSON.stringify(client.words, null, 2));

    i.reply(`✅ Removed: ${word}`);
  }
};