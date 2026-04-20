const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",

  execute(member, client) { // ✅ client MUST be here

    client.log(member.guild, new EmbedBuilder()
      .setColor("#2ecc71")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ size: 32 })
      })
      .setDescription("Member joined")
      .addFields(
        { name: "\u200B", value: `${member} (${member.guild.memberCount}th)` },
        { name: "\u200B", value: `created <t:${Math.floor(member.user.createdTimestamp/1000)}:R>` }
      )
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp()
    );
  }
};