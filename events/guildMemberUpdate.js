const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",

  async execute(oldM, newM, client) {

    // ✅ REMOVE @everyone
    const oldRoles = oldM.roles.cache.filter(r => r.id !== newM.guild.id);
    const newRoles = newM.roles.cache.filter(r => r.id !== newM.guild.id);

    // ✅ STRICT DIFF
    const added = newRoles.filter(r => !oldRoles.has(r.id));
    const removed = oldRoles.filter(r => !newRoles.has(r.id));

    // ❌ NOTHING CHANGED
    if (!added.size && !removed.size) return;

    // ✅ FETCH AUDIT LOG
    let entry;
    try {
      const logs = await newM.guild.fetchAuditLogs({
        limit: 5,
        type: AuditLogEvent.MemberRoleUpdate
      });

      // ✅ find correct log for THIS user
      entry = logs.entries.find(e =>
        e.target.id === newM.id &&
        Date.now() - e.createdTimestamp < 5000
      );

    } catch {}

    if (!entry) return; // ❌ ignore fake updates

    const executor = entry.executor;

    // ✅ VERIFY ROLE CHANGE MATCHES AUDIT
    const changedRoleIds = entry.changes
      ?.find(c => c.key === "$add" || c.key === "$remove")
      ?.new?.map(r => r.id) || [];

    // ✅ ROLE ADDED
    for (const role of added.values()) {

      // ❌ ignore if not in audit log
      if (!changedRoleIds.includes(role.id)) continue;

      client.log(newM.guild, new EmbedBuilder()
        .setColor("#2ecc71")
        .setAuthor({
          name: executor?.tag || newM.user.tag,
          iconURL: executor?.displayAvatarURL({ size: 32 })
        })
        .setDescription(`**Role Added**\n\n${role}`)
        .setFooter({ text: `ID: ${newM.id}` })
        .setTimestamp()
      );
    }

    // ✅ ROLE REMOVED
    for (const role of removed.values()) {

      if (!changedRoleIds.includes(role.id)) continue;

      client.log(newM.guild, new EmbedBuilder()
        .setColor("#e74c3c")
        .setAuthor({
          name: executor?.tag || newM.user.tag,
          iconURL: executor?.displayAvatarURL({ size: 32 })
        })
        .setDescription(`**Role Removed**\n\n${role}`)
        .setFooter({ text: `ID: ${newM.id}` })
        .setTimestamp()
      );
    }
  }
};