const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Remove warning")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User") 
        .setRequired(true)
    ),

  async execute(i, client) {

    const user = i.options.getUser("user");
    const gid = i.guild.id;

    if (client.warns[gid]) delete client.warns[gid][user.id];

    const caseId = client.addCase(gid, {
      user: user.id,
      action: "unwarn",
      reason: "Removed warning",
      moderator: i.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor("#95a5a6")
      .setTitle(`unwarn | case ${caseId}`)
      .addFields(
        { name: "User", value: `${user}` },
        { name: "Moderator", value: i.user.tag }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    client.modLog(i.guild, embed);

    i.reply({ content: "✅ Warning removed", ephemeral: true });
  }
};