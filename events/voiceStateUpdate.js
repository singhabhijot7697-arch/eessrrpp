const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  execute(oldS, newS, client) {

    const user = newS.member.user;

    // ✅ JOIN
    if (!oldS.channel && newS.channel) {
      const embed = new EmbedBuilder()
        .setColor("#2ecc71")
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription("**Member joined voice channel**")
        .addFields({
          name: "\u200B",
          value: `${user.username} joined ${newS.channel}`
        })
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp();

      client.log(newS.guild, embed);
    }

    // ✅ LEAVE
    if (oldS.channel && !newS.channel) {
      const embed = new EmbedBuilder()
        .setColor("#e74c3c")
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription("**Member left voice channel**")
        .addFields({
          name: "\u200B",
          value: `${user.username} left ${oldS.channel}`
        })
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp();

      client.log(newS.guild, embed);
    }

    // ✅ MOVE
    if (
      oldS.channel &&
      newS.channel &&
      oldS.channel.id !== newS.channel.id
    ) {
      const embed = new EmbedBuilder()
        .setColor("#f1c40f")
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription("**Member changed voice channel**")
        .addFields(
          { name: "Before", value: `${oldS.channel}` },
          { name: "+After", value: `${newS.channel}` }
        )
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp();

      client.log(newS.guild, embed);
    }
  }
};