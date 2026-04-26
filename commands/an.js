const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("an")
    .setDescription("Send maintenance announcement")

    // ✅ REQUIRED FIRST (IMPORTANT)
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
        .setRequired(true)
    )

    // ✅ OPTIONAL AFTER
    .addStringOption(o =>
      o.setName("title_emoji")
        .setDescription("Emoji for title")
    )
    .addStringOption(o =>
      o.setName("date_emoji")
        .setDescription("Emoji for date")
    )
    .addStringOption(o =>
      o.setName("server_emoji")
        .setDescription("Emoji for servers")
    )
    .addAttachmentOption(o =>
      o.setName("image")
        .setDescription("Image for embed") // ✅ REQUIRED FIX
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ flags: 64 });

    const config = client.getConfig(interaction.guild.id);

    const allowed =
      interaction.user.id === process.env.OWNER_ID ||
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!allowed) {
      return interaction.editReply({ content: "❌ Not allowed" });
    }

    const date = interaction.options.getString("date");
    const serversText = interaction.options.getString("servers");
    const role = interaction.options.getRole("role");

    const e1 = interaction.options.getString("title_emoji") || "⚠️";
    const e2 = interaction.options.getString("date_emoji") || "📅";
    const e3 = interaction.options.getString("server_emoji") || "📋";

    const image = interaction.options.getAttachment("image");

    const embed = new EmbedBuilder()
      .setColor("#0073ff")
      .setTitle(`${e1} Infrastructure Maintenance`)
      .setDescription(
        `Scheduled maintenance will be carried out on the hosting side.\n\n` +
        `${e2} **Maintenance Date**\n${date}\n\n` +
        `${e3} **Affected Servers**\n${serversText}`
      )
      .setFooter({ text: "Thank you for your understanding." })
      .setTimestamp();

    if (image) embed.setThumbnail(image.url);

    await interaction.channel.send({
      content: `||${role}||`,
      embeds: [embed],
      allowedMentions: { roles: [role.id] }
    });

    await interaction.editReply({ content: "✅ Announcement sent" });
  }
};