const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelCreate",
  async execute(channel, client) {

    const executor = await client.getExecutor(channel.guild, AuditLogEvent.ChannelCreate);

    client.log(channel.guild, new EmbedBuilder()
      .setColor("#2ecc71")
      .setAuthor({ name: executor ? executor.tag : "Unknown" })
      .setDescription(`Channel created\n${channel}`)
      .addFields({ name: "ID", value: channel.id })
      .setTimestamp()
    );
  }
};