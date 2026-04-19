const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  execute(oldS, newS, client) {

    const user = newS.member.user;

    if (!oldS.channel && newS.channel) {
      client.log(newS.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 32 }) })
        .setDescription(`${user.tag} joined ${newS.channel}`)
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }

    if (oldS.channel && !newS.channel) {
      client.log(newS.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 32 }) })
        .setDescription(`${user.tag} left ${oldS.channel}`)
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }
  }
};