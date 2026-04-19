const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cases")
    .setDescription("View user cases")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    if (interaction.user.id !== process.env.OWNER_ID)
      return interaction.reply({ content: "❌ Owner only", ephemeral: true });

    const user = interaction.options.getUser("user");

    const cases = client.cases[interaction.guild.id] || [];
    const userCases = cases.filter(c => c.user === user.id);

    if (!userCases.length)
      return interaction.reply({ content: "No cases found", ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setTitle("User Cases")
      .setDescription(
        userCases.map(c =>
          `**#${c.id}** • ${c.action}\nReason: ${c.reason}`
        ).join("\n\n")
      )
      .setFooter({ text: `Total Cases: ${userCases.length}` })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};