const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cases")
    .setDescription("View moderation cases of a user")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to check")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user");

    const cases = client.cases[interaction.guild.id] || [];
    const userCases = cases.filter(c => c.user === user.id);

    if (!userCases.length)
      return interaction.reply("No cases found");

    const text = userCases
      .map(c => `#${c.id} | ${c.action} | ${c.reason}`)
      .join("\n");

    interaction.reply(text);
  }
};