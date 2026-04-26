const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban user")
    .addUserOption(o => o.setName("user").setDescription("User").setRequired(true)),

  async execute(i, client) {
    await i.deferReply({ flags: 64 });

    const user = i.options.getUser("user");

    await i.guild.members.unban(user.id).catch(()=>{});

    await user.send(`✅ You were unbanned from ${i.guild.name}`).catch(()=>{});

    const caseId = client.addCase(i.guild.id, {
      user: user.id,
      action: "unban",
      reason: "Unban",
      moderator: i.user.tag
    });

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle(`unban | case ${caseId}`)
      .addFields(
        { name: "User", value: `${user}` },
        { name: "Moderator", value: i.user.tag }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    await client.modLog(i.guild, embed);

    i.editReply("✅ Unbanned");
  }
};