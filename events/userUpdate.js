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

      // ✅ BANNER CHANGE
if (oldUser.banner !== newUser.banner) {
  client.guilds.cache.forEach(guild => {
    const member = guild.members.cache.get(newUser.id);
    if (!member) return;

    const bannerURL = newUser.bannerURL({ size: 512 });

    client.log(guild, new EmbedBuilder()
      .setColor("#9b59b6")
      .setAuthor({
        name: newUser.tag,
        iconURL: newUser.displayAvatarURL({ size: 32 })
      })
      .setDescription(`Banner update\n${member}`)
      .setImage(bannerURL) // ✅ big preview
      .setFooter({ text: `ID: ${newUser.id}` })
      .setTimestamp()
    );
  });
}

// ✅ BIO CHANGE
if (oldUser.globalName !== newUser.globalName) {
  client.guilds.cache.forEach(guild => {
    const member = guild.members.cache.get(newUser.id);
    if (!member) return;

    client.log(guild, new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({
        name: newUser.tag,
        iconURL: newUser.displayAvatarURL({ size: 32 })
      })
      .setDescription("Profile updated")
      .addFields(
        { name: "Before", value: oldUser.globalName || "None" },
        { name: "+After", value: newUser.globalName || "None" }
      )
      .setFooter({ text: `ID: ${newUser.id}` })
      .setTimestamp()
    );
  });
}
    });
  }
};