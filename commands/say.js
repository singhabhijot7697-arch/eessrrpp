const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Send message")
    .addStringOption(o =>
      o.setName("text")
        .setDescription("Message")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    const config = client.getConfig(interaction.guild.id);

    // ✅ whitelist / owner check
    const allowed =
      interaction.user.id === process.env.OWNER_ID ||
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!allowed)
      return interaction.reply({ content: "❌ Not allowed", ephemeral: true });

    const text = interaction.options.getString("text");

    await interaction.reply({ content: "✅ Sent", ephemeral: true });

    await interaction.channel.send(text);

    // ✅ LOG (INSIDE FUNCTION ✅)
    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("/say used")
      .addFields(
        { name: "User", value: interaction.user.tag },
        { name: "Server", value: interaction.guild.name },
        { name: "Message", value: text }
      )
      .setTimestamp();

    client.ownerLogEmbed(client, embed, interaction.guild);
  }
};