const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",

  execute(oldS, newS, client) {

    const member = newS.member;
    if (!member || member.user.bot) return;

    const user = member.user;

    // ✅ MOVE
    if (oldS.channel && newS.channel && oldS.channel.id !== newS.channel.id) {

      client.log(newS.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription("Member changed voice channel")
        .addFields(
          { name: "Before", value: `${oldS.channel}` },
          { name: "+After", value: `${newS.channel}` }
        )
        // ✅ ID IN FOOTER
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }

    // ✅ JOIN
    if (!oldS.channel && newS.channel) {

      client.log(newS.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription(`Member joined voice channel\n${user.tag} joined ${newS.channel}`)
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }

    // ✅ LEAVE
    if (oldS.channel && !newS.channel) {

      client.log(newS.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription(`Member left voice channel\n${user.tag} left ${oldS.channel}`)
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }
  }
};