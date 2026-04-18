const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roleDelete",
  execute(role, client) {

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setDescription(`**Role Deleted**\n${role.name}`)
      .setFooter({ text: `Role ID: ${role.id}` })
      .setTimestamp();

    client.log(role.guild, embed);
  }
};