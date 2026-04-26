const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addword")
    .setDescription("Add blocked word")
    .addStringOption(o =>
      o.setName("word")
        .setDescription("Word to add")
        .setRequired(true)
    ),

  async execute(i, client) {

    const word = i.options.getString("word").toLowerCase();

    if (client.words.includes(word))
      return i.reply("Already exists");

    client.words.push(word);

    fs.writeFileSync("./data/words.json", JSON.stringify(client.words, null, 2));

    i.reply(`✅ Added: ${word}`);
  }
};