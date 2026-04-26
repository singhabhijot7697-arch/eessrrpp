const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban user")
    .addUserOption(o => o.setName("user").setDescription("User").setRequired(true))
    .addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(true)),

  async execute(i, client) {
    await i.deferReply({ flags: 64 });

    const user = i.options.getUser("user");
    const reason = i.options.getString("reason");

    await i.guild.members.ban(user.id).catch(()=>{});

    await user.send(`🚫 You were banned from ${i.guild.name}\nReason: ${reason}`).catch(()=>{});

    const caseId = client.addCase(i.guild.id, {
      user: user.id,
      action: "ban",
      reason,
      moderator: i.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setTitle(`ban | case ${caseId}`)
      .addFields(
        { name: "Offender", value: `${user}` },
        { name: "Reason", value: reason },
        { name: "Moderator", value: i.user.tag }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    await client.modLog(i.guild, embed);

    i.editReply("✅ Banned");
  }
};