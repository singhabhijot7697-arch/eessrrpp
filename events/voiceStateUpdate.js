const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",

  execute(oldState, newState, client) {

    const member = newState.member;
    if (!member || member.user.bot) return;

    const user = member.user;

    // ✅ JOIN
    if (!oldState.channel && newState.channel) {
      client.log(newState.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription(`Member joined voice channel\n${user.tag} joined ${newState.channel}`)
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }

    // ✅ LEAVE
    if (oldState.channel && !newState.channel) {
      client.log(newState.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription(`Member left voice channel\n${user.tag} left ${oldState.channel}`)
        .setFooter({ text: `ID: ${user.id}` })
        .setTimestamp()
      );
    }

    // ✅ MOVE
    if (
      oldState.channel &&
      newState.channel &&
      oldState.channel.id !== newState.channel.id
    ) {
      client.log(newState.guild, new EmbedBuilder()
        .setColor("#9b59b6")
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ size: 32 })
        })
        .setDescription("Member changed voice channel")
        .addFields(
          { name: "Before", value: `${oldState.channel}` },
          { name: "+After", value: `${newState.channel}` },
          { name: "ID", value: user.id }
        )
        .setTimestamp()
      );
    }
  }
};