const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  execute(member, client) {

    const roles = member.roles.cache
      .filter(r => r.id !== member.guild.id)
      .map(r => r.toString())
      .join(", ") || "None";

    client.log(member.guild, new EmbedBuilder()
      .setColor("#e74c3c")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ size: 32 })
      })
      .setDescription("**Member Left**")
      .addFields(
        { name: "Roles", value: roles },
        { name: "\u200B", value: "`\n`" }
      )
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp()
    );
  }
};