const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roleCreate",
  execute(role, client) {

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setDescription("**New role created**")
      .addFields(
        { name: "Name", value: role.name },
        {
          name: "Color",
          value: `#${role.color.toString(16).padStart(6, "0")}`
        },
        {
          name: "Mentionable",
          value: role.mentionable ? "True" : "False"
        },
        {
          name: "Displayed separately",
          value: role.hoist ? "True" : "False"
        }
      )
      .setFooter({ text: `Role ID: ${role.id}` })
      .setTimestamp();

    client.log(role.guild, embed);
  }
};