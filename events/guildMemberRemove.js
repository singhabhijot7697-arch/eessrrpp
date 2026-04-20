const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",

  execute(member, client) { // ✅ client MUST be here

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
      .setDescription("Member left")
      .addFields(
        { name: "\u200B", value: `${member} joined <t:${Math.floor(member.joinedTimestamp/1000)}:R>` },
        { name: "Roles", value: roles },
        { name: "ID", value: member.id }
      )
      .setTimestamp()
    );
  }
};