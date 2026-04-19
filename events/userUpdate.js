const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userUpdate",

  execute(oldUser, newUser, client) {

    // ✅ AVATAR CHANGE ONLY
    if (oldUser.avatar === newUser.avatar) return;

    client.guilds.cache.forEach(guild => {
      const member = guild.members.cache.get(newUser.id);
      if (!member) return;

      const embed = new EmbedBuilder()
        .setColor("#9b59b6")

        // ✅ USER ON TOP LEFT
        .setAuthor({
          name: newUser.tag,
          iconURL: newUser.displayAvatarURL({ size: 32 })
        })
        // ✅ TEXT FORMAT
        .setDescription(`Avatar update\n${member}`)
        // ✅ IMAGE TOP RIGHT
        .setThumbnail(newUser.displayAvatarURL({ size: 256 }))
        // ✅ SMALL FOOTER
        .setFooter({ text: `ID: ${newUser.id}` })

        .setTimestamp();

      client.log(guild, embed);
    });
  }
};