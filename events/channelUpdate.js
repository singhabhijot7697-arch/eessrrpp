const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelUpdate",

  async execute(oldC, newC, client) {

    const oldPerms = oldC.permissionOverwrites.cache;
    const newPerms = newC.permissionOverwrites.cache;

    let executor;
    try {
      const logs = await newC.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelOverwriteUpdate
      });
      executor = logs.entries.first()?.executor;
    } catch {}

    // ✅ LOOP OVER PERMISSIONS
    for (const [id, newPerm] of newPerms) {

      const oldPerm = oldPerms.get(id);
      if (!oldPerm) continue;

      const changes = [];

      const allPerms = new Set([
        ...oldPerm.allow.toArray(),
        ...oldPerm.deny.toArray(),
        ...newPerm.allow.toArray(),
        ...newPerm.deny.toArray()
      ]);

      for (const perm of allPerms) {

        const before = oldPerm.allow.has(perm)
          ? "✅"
          : oldPerm.deny.has(perm)
          ? "❌"
          : "⬜";

        const after = newPerm.allow.has(perm)
          ? "✅"
          : newPerm.deny.has(perm)
          ? "❌"
          : "⬜";

        if (before !== after) {
          changes.push(`${formatPerm(perm)}: ${before} ➜ ${after}`);
        }
      }

      if (!changes.length) continue;

      // ✅ FIND TARGET (ROLE OR USER)
      const target =
        newC.guild.roles.cache.get(id) ||
        newC.guild.members.cache.get(id);

      const embed = new EmbedBuilder()
        .setColor("#f1c40f")
        .setAuthor({
          name: executor ? executor.tag : "Unknown",
          iconURL: executor?.displayAvatarURL({ size: 32 })
        })
        .setDescription(
          `Text channel updated\nOverwrites for ${target} in ${newC} updated`
        )
        .addFields({
          name: "Changes",
          value: changes.join("\n")
        })
        .setFooter({ text: `Channel ID: ${newC.id}` })
        .setTimestamp();

      client.log(newC.guild, embed);
    }
  }
};

// ✅ FORMAT PERMISSION NAME
function formatPerm(perm) {
  return perm
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, c => c.toUpperCase());
}