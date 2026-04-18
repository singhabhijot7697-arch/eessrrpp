const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("an")
    .setDescription("Send maintenance announcement")
    .addStringOption(o =>
      o.setName("date")
        .setDescription("Maintenance date & time")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("servers")
        .setDescription("Affected servers")
        .setRequired(true)
    )
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to ping")
    )
    .addAttachmentOption(o =>
      o.setName("image")
        .setDescription("Attach image")
    ),

  async execute(interaction) {
    const date = interaction.options.getString("date");
    const servers = interaction.options.getString("servers");
    const role = interaction.options.getRole("role");
    const image = interaction.options.getAttachment("image");

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setAuthor({ name: `${interaction.guild.name} | Support` })
      .setTitle("⚠️ Infrastructure Maintenance")
      .setDescription(
        `Scheduled maintenance will be carried out on the hosting side. During this time, brief interruptions in service and network timeouts may occur.\n\n` +
        `📅 **Maintenance Date**\n${date}\n\n` +
        `📋 **Affected Servers**\n${servers}`
      )
      .setFooter({ text: "Thank you for your understanding." })
      .setTimestamp();

    // ✅ TOP RIGHT IMAGE
    if (image) embed.setThumbnail(image.url);

    await interaction.reply({ content: "✅ Announcement sent", ephemeral: true });

    await interaction.channel.send({
      content: role ? `${role}` : "",
      embeds: [embed],
      allowedMentions: role ? { roles: [role.id] } : {}
    });
  }
};