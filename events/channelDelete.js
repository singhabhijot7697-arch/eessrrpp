const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelDelete",

  async execute(channel, client) {

    // ✅ GET EXECUTOR (optional)
    let executor;
    try {
      const logs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelDelete
      });
      executor = logs.entries.first()?.executor;
    } catch {}

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setDescription("Text channel deleted")
      .addFields(
        { name: "Name", value: channel.name },
        { name: "Category", value: channel.parent ? channel.parent.name : "None" }
      )
      .setFooter({ text: `Channel ID: ${channel.id}` })
      .setTimestamp();

    client.log(channel.guild, embed);
  }
};