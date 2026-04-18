const fs = require("fs");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addword")
    .setDescription("Add a banned word")
    .addStringOption(o =>
      o.setName("word")
        .setDescription("Word to add")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const word = interaction.options.getString("word").toLowerCase();

    if (client.words.includes(word))
      return interaction.reply("Already exists");

    client.words.push(word);
    fs.writeFileSync("./data/words.json", JSON.stringify(client.words, null, 2));

    interaction.reply(`✅ Added: ${word}`);
  }
};