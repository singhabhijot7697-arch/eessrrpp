const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  execute(oldMsg, newMsg, client) {
    if (!oldMsg.guild || oldMsg.content === newMsg.content) return;

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({
        name: oldMsg.author.tag,
        iconURL: oldMsg.author.displayAvatarURL({ size: 32 })
      })

      // ✅ BIG HEADER
      .setDescription(`**Message edited in ${oldMsg.channel}**`)

      // ✅ BEFORE / AFTER CLEAN
      .addFields(
        { name: "Before", value: oldMsg.content || "None" },
        { name: "+After", value: newMsg.content || "None" }
      )

      // ✅ MESSAGE ID ABOVE FOOTER
      .addFields(
        { name: "\u200B", value: `Message ID: ${oldMsg.id}` }
      )

      // ✅ USER ID FOOTER
      .setFooter({ text: `ID: ${oldMsg.author.id}` })
      .setTimestamp();

    client.log(oldMsg.guild, embed);
  }
};