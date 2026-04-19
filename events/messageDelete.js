const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageDelete",
  execute(msg, client) {
    if (!msg.guild || !msg.author) return;

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setAuthor({
        name: msg.author.tag,
        iconURL: msg.author.displayAvatarURL({ size: 32 })
      })

      // ✅ BIG TITLE STYLE
      .setDescription(`**Message deleted in ${msg.channel}**`)
      // ✅ SMALL CONTENT
      .addFields(
        { name: "\u200B", value: msg.content || "None" }
      )
      // ✅ MESSAGE ID ABOVE FOOTER (SAME STYLE)
      .addFields(
        { name: "\u200B", value: `Message ID: ${msg.id}` }
      )
      // ✅ FOOTER = USER ID
      .setFooter({ text: `ID: ${msg.author.id}` })
      .setTimestamp();

    client.log(msg.guild, embed);
  }
};