const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("an")
    .setDescription("Send maintenance announcement")

    // ✅ REQUIRED FIRST
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

    // ✅ EMOJIS
    .addStringOption(o =>
      o.setName("emoji1")
        .setDescription("Emoji for title")
    )
    .addStringOption(o =>
      o.setName("emoji2")
        .setDescription("Emoji for date")
    )
    .addStringOption(o =>
      o.setName("emoji3")
        .setDescription("Emoji for servers")
    )

    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to ping")
    )

    .addAttachmentOption(o =>
      o.setName("image")
        .setDescription("Attach image (top-right)")
    ),

  async execute(interaction, client) {

    const config = client.getConfig(interaction.guild.id);

    // ✅ PERMISSION
    const allowed =
      interaction.user.id === process.env.OWNER_ID ||
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!allowed) {
      return interaction.reply({ content: "❌ Not allowed", ephemeral: true });
    }

    const date = interaction.options.getString("date");
    const servers = interaction.options.getString("servers");

    const emoji1 = interaction.options.getString("emoji1") || "⚠️";
    const emoji2 = interaction.options.getString("emoji2") || "📅";
    const emoji3 = interaction.options.getString("emoji3") || "📋";

    const role = interaction.options.getRole("role");
    const image = interaction.options.getAttachment("image");

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setAuthor({ name: `${interaction.guild.name} | Support` })
      .setTitle(`${emoji1} Infrastructure Maintenance`)
      .setDescription(
        `Scheduled maintenance will be carried out on the hosting side. During this time, brief interruptions in service and network timeouts may occur.\n\n` +
        `${emoji2} **Maintenance Date**\n${date}\n\n` +
        `${emoji3} **Affected Servers**\n${servers}`
      )
      .setFooter({ text: "Thank you for your understanding." })
      .setTimestamp();

    // ✅ IMAGE TOP RIGHT
    if (image) embed.setThumbnail(image.url);

    await interaction.reply({ content: "✅ Announcement sent", ephemeral: true });

    await interaction.channel.send({
      content: role ? `${role}` : "",
      embeds: [embed],
      allowedMentions: role ? { roles: [role.id] } : {}
    });
  }
};