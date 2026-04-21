const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelUpdate",

  async execute(oldC, newC, client) {

    // ✅ GET EXECUTOR
    let executor;
    try {
      const logs = await newC.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelOverwriteUpdate
      });
      executor = logs.entries.first()?.executor;
    } catch {}

    const oldPerms = oldC.permissionOverwrites.cache;
    const newPerms = newC.permissionOverwrites.cache;

    // ✅ CHECK EACH TARGET (role/user)
    for (const [id, newPerm] of newPerms) {

      const oldPerm = oldPerms.get(id);
      if (!oldPerm) continue;

      const changes = [];

      const perms = new Set([
        ...oldPerm.allow.toArray(),
        ...oldPerm.deny.toArray(),
        ...newPerm.allow.toArray(),
        ...newPerm.deny.toArray()
      ]);

      perms.forEach(p => {

        const before = oldPerm.allow.has(p)
          ? "✅"
          : oldPerm.deny.has(p)
          ? "❌"
          : "⬜";

        const after = newPerm.allow.has(p)
          ? "✅"
          : newPerm.deny.has(p)
          ? "❌"
          : "⬜";

        if (before !== after) {
          changes.push(`${formatPerm(p)}: ${before} ➜ ${after}`);
        }
      });

      if (!changes.length) continue;

      // ✅ GET TARGET (ROLE / USER)
      const target =
        newC.guild.roles.cache.get(id) ||
        newC.guild.members.cache.get(id);

      const embed = new EmbedBuilder()
        .setColor("#f1c40f")
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

// ✅ FORMAT PERMISSIONS
function formatPerm(perm) {
  return perm
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}