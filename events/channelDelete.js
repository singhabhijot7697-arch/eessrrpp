const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelDelete",
  async execute(channel, client) {

    const executor = await client.getExecutor(channel.guild, AuditLogEvent.ChannelDelete);

    client.log(channel.guild, new EmbedBuilder()
      .setColor("#e74c3c")
      .setAuthor({ name: executor ? executor.tag : "Unknown" })
      .setDescription(`Channel deleted\n${channel.name}`)
      .addFields({ name: "ID", value: channel.id })
      .setTimestamp()
    );
  }
};