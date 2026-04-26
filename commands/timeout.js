const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout user")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User") 
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName("minutes")
        .setDescription("Minutes") 
        .setRequired(true)
    ),

  async execute(i, client) {

    await i.deferReply({ flags: 64 });

    const user = i.options.getUser("user");
    const mins = i.options.getInteger("minutes");

    const member = await i.guild.members.fetch(user.id);

    await member.timeout(mins * 60000).catch(()=>{});

    await user.send(`⏱️ Muted in ${i.guild.name} for ${mins} minutes`).catch(()=>{});

    const caseId = client.addCase(i.guild.id, {
      user: user.id,
      action: "timeout",
      reason: `${mins} minutes`,
      moderator: i.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor("#e67e22")
      .setTitle(`timeout | case ${caseId}`)
      .addFields(
        { name: "Offender", value: `${user}` },
        { name: "Duration", value: `${mins} minutes` },
        { name: "Moderator", value: i.user.tag }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    client.modLog(i.guild, embed);

    i.editReply("✅ Timed out");
  }
};