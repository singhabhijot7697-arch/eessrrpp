const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send message")
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message to send") // ✅ FIXED
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

    const text = interaction.options.getString("text");

    await interaction.channel.send(text);
    await interaction.editReply({ content: "✅ Sent" });

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("/say used")
      .addFields(
        { name: "User", value: interaction.user.tag },
        { name: "Message", value: text }
      )
      .setTimestamp();

    client.ownerLogEmbed(client, embed, interaction.guild);
  }
};