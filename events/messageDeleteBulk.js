const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageDeleteBulk",
  execute(messages, client) {
    const guild = messages.first().guild;

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription("🧹 Messages purged")
      .addFields({ name: "Amount", value: `${messages.size}` })
      .setTimestamp();

    client.log(guild, embed);
  }
};