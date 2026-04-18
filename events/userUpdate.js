const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userUpdate",
  execute(oldUser, newUser, client) {

    // ✅ AVATAR CHANGE (TOP RIGHT)
    if (oldUser.avatar !== newUser.avatar) {
      client.guilds.cache.forEach(guild => {
        const member = guild.members.cache.get(newUser.id);
        if (!member) return;

        client.log(guild, new EmbedBuilder()
          .setColor("#9b59b6")
          .setAuthor({
            name: newUser.tag,
            iconURL: newUser.displayAvatarURL({ size: 32 })
          })
          .setThumbnail(newUser.displayAvatarURL({ size: 128 })) // TOP RIGHT
          .setDescription("**Avatar Updated**")
          .setFooter({ text: `ID: ${newUser.id}` })
          .setTimestamp()
        );
      });
    }

    // ✅ USERNAME CHANGE
    if (oldUser.username !== newUser.username) {
      client.guilds.cache.forEach(guild => {
        const member = guild.members.cache.get(newUser.id);
        if (!member) return;

        client.log(guild, new EmbedBuilder()
          .setColor("#3498db")
          .setAuthor({
            name: newUser.tag,
            iconURL: newUser.displayAvatarURL({ size: 32 })
          })
          .setDescription("**Username Changed**")
          .addFields(
            { name: "Before", value: oldUser.username },
            { name: "+After", value: newUser.username }
          )
          .setFooter({ text: `ID: ${newUser.id}` })
          .setTimestamp()
        );
      });
    }
  }
};