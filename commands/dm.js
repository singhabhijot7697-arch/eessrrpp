const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Send DM")
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

    const isWhitelisted =
      config.whitelist.includes(interaction.user.id) ||
      interaction.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (!isWhitelisted) {
      return interaction.reply({ content: "❌ Not whitelisted", ephemeral: true });
    }

    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("text");

    await user.send(text).catch(()=>{});
    interaction.reply({ content: "✅ DM sent", ephemeral: true });
  }
};