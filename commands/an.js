const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("an")
    .setDescription("Send maintenance announcement")

    // ✅ REQUIRED
    .addStringOption(o =>
      o.setName("date")
        .setDescription("Maintenance date & time")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("servers")
        .setDescription("Affected servers (text)")
        .setRequired(true)
    )

    // ✅ ROLE FOR PING
    .addRoleOption(o =>
      o.setName("role")
        .setDescription("Role to ping")
        .setRequired(true)
    )

    // ✅ EMOJIS
    .addStringOption(o => o.setName("title_emoji").setDescription("Title emoji"))
    .addStringOption(o => o.setName("date_emoji").setDescription("Date emoji"))
    .addStringOption(o => o.setName("server_emoji").setDescription("Server emoji"))

    // ✅ IMAGE
    .addAttachmentOption(o =>
      o.setName("image")
        .setDescription("Image (top-right)")
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ flags: 64 });

    const config = client.getConfig(interaction.guild.id);

    // ✅ PERMISSION CHECK
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

    // ✅ EMOJIS
    const e1 = interaction.options.getString("title_emoji") || "⚠️";
    const e2 = interaction.options.getString("date_emoji") || "📅";
    const e3 = interaction.options.getString("server_emoji") || "📋";

    const image = interaction.options.getAttachment("image");

    // ✅ EMBED (TEXT ONLY)
    const embed = new EmbedBuilder()
      .setColor("#5100ff")
      .setTitle(`${e1} Infrastructure Maintenance`)
      .setDescription(
        `Scheduled maintenance will be carried out on the hosting side. During this time, brief interruptions in service and network timeouts may occur.\n\n` +

        `${e2} **Maintenance Date**\n${date}\n\n` +

        `${e3} **Affected Servers**\n${serversText}`
      )
      .setFooter({ text: "Thank you for your understanding." })
      .setTimestamp();

    if (image) embed.setThumbnail(image.url);
    
    // ✅ SEND MESSAGE (ROLE SPOILER)
    await interaction.channel.send({
      content: `||${role}||`,
      embeds: [embed],
      allowedMentions: { roles: [role.id] }
    });

    await interaction.editReply({ content: "✅ Announcement sent" });

    // ✅ ✅ LOG SYSTEM
    const logEmbed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("/an used")
      .addFields(
        { name: "User", value: interaction.user.tag },
        { name: "Server", value: interaction.guild.name },
        { name: "Maintenance Date", value: date },
        { name: "Affected Servers", value: serversText },
        { name: "Ping Role", value: role.name }
      )
      .setFooter({ text: `ID: ${interaction.user.id}` })
      .setTimestamp();

    client.ownerLogEmbed(client, logEmbed, interaction.guild);
  }
};