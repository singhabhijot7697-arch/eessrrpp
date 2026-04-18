module.exports = {
  name: "channelPinsUpdate",
  execute(channel, time, client) {
    client.log(channel.guild, {
      description: "📌 Pins Updated",
      fields: [{ name: "Channel", value: channel.toString() }]
    });
  }
};