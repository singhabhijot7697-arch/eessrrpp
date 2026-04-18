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
      .setDescription("**Message Deleted**")
      .addFields(
        { name: "Content", value: msg.content || "None" },
        { name: "Channel", value: `${msg.channel}` }
      )
      .setFooter({ text: `ID: ${msg.author.id}` })
      .setTimestamp();

    client.log(msg.guild, embed);
  }
};