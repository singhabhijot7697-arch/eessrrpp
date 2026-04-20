const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "roleUpdate",

  async execute(oldR, newR, client) {

    let changes = [];

    // ✅ NAME
    if (oldR.name !== newR.name) {
      changes.push(`Name: ${oldR.name} ➜ ${newR.name}`);
    }

    // ✅ COLOR
    if (oldR.color !== newR.color) {
      const oldC = `#${oldR.color.toString(16).padStart(6, '0')}`;
      const newC = `#${newR.color.toString(16).padStart(6, '0')}`;
      changes.push(`Color: ${oldC} ➜ ${newC}`);
    }

    // ✅ POSITION
    if (oldR.position !== newR.position) {
      changes.push(`Position: ${oldR.position} ➜ ${newR.position}`);
    }

    // ✅ MENTIONABLE
    if (oldR.mentionable !== newR.mentionable) {
      changes.push(`Mentionable: ${oldR.mentionable ? "✅" : "❌"} ➜ ${newR.mentionable ? "✅" : "❌"}`);
    }

    // ✅ HOIST
    if (oldR.hoist !== newR.hoist) {
      changes.push(`Displayed separately: ${oldR.hoist ? "✅" : "❌"} ➜ ${newR.hoist ? "✅" : "❌"}`);
    }

    // ✅ PERMISSION DIFF
    const allPerms = new Set([
      ...oldR.permissions.toArray(),
      ...newR.permissions.toArray()
    ]);

    allPerms.forEach(p => {
      const before = oldR.permissions.has(p) ? "✅" : "❌";
      const after = newR.permissions.has(p) ? "✅" : "❌";

      if (before !== after) {
        changes.push(`${formatPerm(p)}: ${before} ➜ ${after}`);
      }
    });

    // ✅ ICON CHANGE
    let iconChanged = false;
    if (oldR.icon !== newR.icon) {
      changes.push("Role icon updated");
      iconChanged = true;
    }

    // ❌ nothing changed
    if (!changes.length) return;

    // ✅ EXECUTOR
    let executor;
    try {
      const logs = await newR.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.RoleUpdate
      });
      executor = logs.entries.first()?.executor;
    } catch {}

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setAuthor({
        name: executor ? executor.tag : "Unknown",
        iconURL: executor?.displayAvatarURL({ size: 32 })
      })
      .setTitle(`Role "${newR.name}" updated`)
      .setDescription(changes.join("\n"))
      .setFooter({ text: `Role ID: ${newR.id}` })
      .setTimestamp();

    // ✅ show icon if changed
    if (iconChanged && newR.icon) {
      embed.setImage(newR.iconURL({ size: 256 }));
    }

    client.log(newR.guild, embed);
  }
};

// ✅ FORMAT PERMISSION NAME
function formatPerm(perm) {
  return perm
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}