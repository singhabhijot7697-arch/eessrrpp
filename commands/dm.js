const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Send DM")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to send DM") // ✅ FIXED
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message content") // ✅ FIXED
        .setRequired(true)
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

    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("text");

    await user.send(text).catch(()=>{});
    await interaction.editReply({ content: "✅ DM sent" });

    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle("/dm used")
      .addFields(
        { name: "From", value: interaction.user.tag },
        { name: "To", value: user.tag },
        { name: "Message", value: text }
      )
      .setTimestamp();

    client.ownerLogEmbed(client, embed, interaction.guild);
  }
};