module.exports = {
  name: "webhooksUpdate",
  execute(channel, client) {
    client.log(channel.guild, {
      description: "🪝 Webhook Updated",
      fields: [{ name: "Channel", value: channel.toString() }]
    });
  }
};