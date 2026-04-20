const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "roleCreate",

  async execute(role, client) {

    let executor;
    try {
      const logs = await role.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleCreate
      });
      executor = logs.entries.first()?.executor;
    } catch {}

    // ✅ COLOR HEX
    const colorHex = `#${role.color.toString(16).padStart(6, '0')}`;

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setAuthor({
        name: executor ? executor.tag : "Unknown",
        iconURL: executor?.displayAvatarURL({ size: 32 })
      })
      .setDescription("New role created")
      .addFields(
        { name: "Name", value: role.name, inline: true },
        { name: "Color", value: colorHex, inline: true },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "Mentionable", value: role.mentionable ? "True" : "False", inline: true },
        { name: "Displayed separately", value: role.hoist ? "True" : "False", inline: true }
      )
      .setFooter({ text: `Role ID: ${role.id}` })
      .setTimestamp();

    client.log(role.guild, embed);
  }
};