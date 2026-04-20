const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("an")
    .setDescription("Send maintenance announcement")

    // ✅ REQUIRED FIRST (IMPORTANT FIX)
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

    // ✅ OPTIONAL AFTER
    .addStringOption(o =>
      o.setName("emoji")
        .setDescription("Emoji (⚠️ or <:emoji:id>)")
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

    // ✅ OWNER OR WHITELIST
    const allowed =
      interaction.user.id === process.env.OWNER_ID ||
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!allowed) {
      return interaction.reply({ content: "❌ Not allowed", ephemeral: true });
    }

    const date = interaction.options.getString("date");
    const servers = interaction.options.getString("servers");
    const emoji = interaction.options.getString("emoji") || "⚠️";
    const role = interaction.options.getRole("role");
    const image = interaction.options.getAttachment("image");

    // ✅ EMBED
    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setAuthor({ name: `${interaction.guild.name} | Support` })
      .setTitle(`${emoji} Infrastructure Maintenance`)
      .setDescription(
        `Scheduled maintenance will be carried out on the hosting side. During this time, brief interruptions in service and network timeouts may occur.\n\n` +
        `📅 **Maintenance Date**\n${date}\n\n` +
        `📋 **Affected Servers**\n${servers}`
      )
      .setFooter({ text: "Thank you for your understanding." })
      .setTimestamp();

    // ✅ IMAGE TOP RIGHT
    if (image) embed.setThumbnail(image.url);

    // ✅ REPLY
    await interaction.reply({ content: "✅ Announcement sent", ephemeral: true });

    // ✅ SEND
    await interaction.channel.send({
      content: role ? `${role}` : "",
      embeds: [embed],
      allowedMentions: role ? { roles: [role.id] } : {}
    });

    // ✅ LOG (OWNER + CHANNEL)
    const logEmbed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("/an used")
      .addFields(
        { name: "User", value: interaction.user.tag },
        { name: "Server", value: interaction.guild.name },
        { name: "Date", value: date },
        { name: "Servers", value: servers }
      )
      .setTimestamp();

    client.ownerLogEmbed(client, logEmbed, interaction.guild);
  }
};