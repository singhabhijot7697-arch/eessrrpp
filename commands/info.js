const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Show user info")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
    ),

  async execute(interaction, client) {

    try {

      const config = client.getConfig(interaction.guild.id);

      const allowed =
        interaction.user.id === process.env.OWNER_ID ||
        config.whitelist.includes(interaction.user.id) ||
        interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

      if (!allowed) {
        return interaction.reply({ content: "❌ Not allowed", ephemeral: true });
      }

      const user = interaction.options.getUser("user") || interaction.user;
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        return interaction.reply({ content: "❌ User not found", ephemeral: true });
      }

      // ✅ time
      const createdTS = Math.floor(user.createdTimestamp / 1000);
      const joinedTS = Math.floor(member.joinedTimestamp / 1000);
      const serverTS = Math.floor(interaction.guild.createdTimestamp / 1000);

      // ✅ roles
      const roles = member.roles.cache
        .filter(r => r.id !== interaction.guild.id)
        .map(r => r.toString())
        .join(" ") || "None";

      // ✅ banner
      const fetched = await user.fetch();
      const banner = fetched.bannerURL({ size: 512 });

      // ✅ EMBED
      const embed = new EmbedBuilder()
        .setColor("#3498db")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 64 })
        })
        .setThumbnail(user.displayAvatarURL({ size: 128 }))
        .setDescription(`**Avatar**\n${member}`)
        .addFields(
          { name: "Roles", value: roles },
          {
            name: "Created at",
            value: `<t:${createdTS}:F>\n(<t:${createdTS}:R>)`
          },
          {
            name: "Joined at",
            value:
              `<t:${joinedTS}:F>\n` +
              `(<t:${joinedTS}:R>)\n` +
              `Joined after <t:${serverTS}:R>`
          }
        )
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp();

      // ✅ BUTTONS (FIXED ✅)
      const components = [
        new ButtonBuilder()
          .setLabel("Avatar")
          .setStyle(ButtonStyle.Link)
          .setURL(user.displayAvatarURL({ size: 512 }))
      ];

      if (banner) {
        components.push(
          new ButtonBuilder()
            .setLabel("Banner")
            .setStyle(ButtonStyle.Link)
            .setURL(banner)
        );
      }

      const row = new ActionRowBuilder().addComponents(components);

      // ✅ SINGLE REPLY ONLY ✅
      await interaction.reply({
        embeds: [embed],
        components: [row]
      });

    } catch (err) {
      console.error(err);

      if (!interaction.replied) {
        interaction.reply({ content: "❌ Error occurred", ephemeral: true });
      }
    }
  }
};