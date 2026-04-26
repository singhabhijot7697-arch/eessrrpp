const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn user")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("reason")
        .setDescription("Reason")
    ),

  async execute(i, client) {

    await i.deferReply({ flags: 64 });

    const user = i.options.getUser("user");
    const reason = i.options.getString("reason") || "No reason";

    const gid = i.guild.id;

    if (!client.warns[gid]) client.warns[gid] = {};
    client.warns[gid][user.id] = (client.warns[gid][user.id] || 0) + 1;

    await user.send(`⚠️ Warned in ${i.guild.name}\nReason: ${reason}`).catch(()=>{});

    const caseId = client.addCase(gid, {
      user: user.id,
      action: "warn",
      reason,
      moderator: i.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle(`warn | case ${caseId}`)
      .addFields(
        { name: "Offender", value: `${user}` },
        { name: "Reason", value: reason },
        { name: "Moderator", value: i.user.tag }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    client.modLog(i.guild, embed);

    i.editReply(`✅ Warned (${client.warns[gid][user.id]}/5)`);
  }
};