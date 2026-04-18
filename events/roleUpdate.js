const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "roleUpdate",
  async execute(oldR, newR, client) {
    const changes = [];

    if (oldR.name !== newR.name)
      changes.push(`✅ Name: ${oldR.name} → ${newR.name}`);

    if (!changes.length) return;

    const executor = await client.getExecutor(newR.guild, AuditLogEvent.RoleUpdate);

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setDescription("🛠 Role Updated")
      .addFields(
        { name: "Role", value: `${newR}` },
        { name: "Executor", value: executor ? executor.tag : "Unknown" },
        { name: "Changes", value: changes.join("\n") }
      )
      .setTimestamp();

    client.log(newR.guild, embed);
  }
};