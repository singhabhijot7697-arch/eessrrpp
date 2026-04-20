const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildUpdate",
  execute(oldG, newG, client) {

    // ✅ SERVER ICON CHANGE
    if (oldG.icon !== newG.icon) {
      client.log(newG, new EmbedBuilder()
        .setColor("#3498db")
        .setDescription("Server icon updated")
        .setImage(newG.iconURL({ size: 512 }))
        .setFooter({ text: `Server ID: ${newG.id}` })
        .setTimestamp()
      );
    }
  }
};