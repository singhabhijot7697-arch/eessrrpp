const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Show user info")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User") // ✅ FIX ADDED
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ flags: 64 });

    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString())
      .join(" ") || "None";

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ size: 32 })
      })
      .setDescription("Avatar")
      .addFields(
        { name: "Roles", value: roles },
        {
          name: "Created at",
          value: `<t:${Math.floor(user.createdTimestamp/1000)}:F>\n(<t:${Math.floor(user.createdTimestamp/1000)}:R>)`
        },
        {
          name: "Joined at",
          value: `<t:${Math.floor(member.joinedTimestamp/1000)}:F>\n(<t:${Math.floor(member.joinedTimestamp/1000)}:R>)`
        }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};