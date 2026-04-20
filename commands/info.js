const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Show user info")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
    ),

  async execute(interaction, client) {

    const config = client.getConfig(interaction.guild.id);

    const allowed =
      interaction.user.id === process.env.OWNER_ID ||
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!allowed)
      return interaction.reply({ content: "❌ Not allowed", ephemeral: true });

    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const joined = `<t:${Math.floor(member.joinedTimestamp/1000)}:F>`;
    const created = `<t:${Math.floor(user.createdTimestamp/1000)}:F>`;

    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString())
      .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 128 }))
      .setDescription(`${member}`)
      .addFields(
        { name: "Joined", value: joined },
        { name: "Created", value: created },
        { name: "Roles", value: roles }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    // ✅ buttons (avatar + banner)
    const fetched = await user.fetch();
    const banner = fetched.bannerURL({ size: 512 });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Avatar")
        .setStyle(ButtonStyle.Link)
        .setURL(user.displayAvatarURL({ size: 512 })),

      banner
        ? new ButtonBuilder()
            .setLabel("Banner")
            .setStyle(ButtonStyle.Link)
            .setURL(banner)
        : null
    ).setComponents(row.components.filter(Boolean));

    interaction.reply({ embeds: [embed], components: [row] });
  }
};