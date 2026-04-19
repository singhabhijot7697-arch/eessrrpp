const fs = require("fs");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeword")
    .setDescription("Remove abuse word")
    .addStringOption(o =>
      o.setName("word")
        .setDescription("Word")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({ content: "❌ Owner only", ephemeral: true });

    const word = interaction.options.getString("word").toLowerCase();

    client.words = client.words.filter(w => w !== word);
    fs.writeFileSync("./data/words.json", JSON.stringify(client.words, null, 2));

    interaction.reply({ content: `✅ Removed: ${word}`, ephemeral: true });
  }
};