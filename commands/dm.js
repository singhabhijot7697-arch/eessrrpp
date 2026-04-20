const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Send DM to user")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    const config = client.getConfig(interaction.guild.id);

    // ✅ whitelist / owner
    const allowed =
      interaction.user.id === process.env.OWNER_ID ||
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!allowed)
      return interaction.reply({ content: "❌ Not allowed", ephemeral: true });

    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("text");

    // ✅ send DM
    await user.send(text).catch(() => {});
    await interaction.reply({ content: "✅ DM sent", ephemeral: true });

    // ✅ LOG (INSIDE FUNCTION ✅)
    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle("/dm used")
      .addFields(
        { name: "From", value: interaction.user.tag },
        { name: "To", value: user.tag },
        { name: "Server", value: interaction.guild.name },
        { name: "Message", value: text }
      )
      .setTimestamp();

    client.ownerLogEmbed(client, embed, interaction.guild);
  }
};