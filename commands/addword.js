const fs = require("fs");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addword")
    .setDescription("Add abuse word")
    .addStringOption(o =>
      o.setName("word")
        .setDescription("Word")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({ content: "❌ Owner only", ephemeral: true });

    const word = interaction.options.getString("word").toLowerCase();

    if (client.words.includes(word))
      return interaction.reply({ content: "Already exists", ephemeral: true });

    client.words.push(word);
    fs.writeFileSync("./data/words.json", JSON.stringify(client.words, null, 2));

    interaction.reply({ content: `✅ Added: ${word}`, ephemeral: true });
  }
};