const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  execute(oldMsg, newMsg, client) {
    if (!oldMsg.guild || oldMsg.content === newMsg.content) return;

    client.log(oldMsg.guild, new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({
        name: oldMsg.author.tag,
        iconURL: oldMsg.author.displayAvatarURL({ size: 32 })
      })
      .setDescription(`**Message Edited**`)
      .addFields(
        { name: "Before", value: `\`${oldMsg.content}\`` },
        { name: "+After", value: `\`${newMsg.content}\`` }
      )
      .setFooter({ text: `ID: ${oldMsg.author.id}` })
      .setTimestamp()
    );
  }
};