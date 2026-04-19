const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",

  async execute(oldM, newM, client) {

    // ✅ fetch last role update from audit logs
    let entry;
    try {
      const logs = await newM.guild.fetchAuditLogs({
        limit: 5,
        type: AuditLogEvent.MemberRoleUpdate
      });

      entry = logs.entries.find(e =>
        e.target.id === newM.id &&
        Date.now() - e.createdTimestamp < 5000
      );
    } catch {}

    // ❌ ignore if no valid audit log
    if (!entry) return;

    const user = newM.user;

    // ✅ check what actually changed in audit
    const changes = entry.changes;

    if (!changes) return;

    for (const change of changes) {

      // ✅ ROLE ADDED
      if (change.key === "$add") {
        for (const roleData of change.new) {
          const role = newM.guild.roles.cache.get(roleData.id);
          if (!role) continue;

          client.log(newM.guild, new EmbedBuilder()
            .setColor("#2ecc71")
            .setAuthor({
              name: user.tag,
              iconURL: user.displayAvatarURL({ size: 32 })
            })
            .setDescription(`**Role added**\n${role}`)
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp()
          );
        }
      }

      // ✅ ROLE REMOVED
      if (change.key === "$remove") {
        for (const roleData of change.new) {
          const role = newM.guild.roles.cache.get(roleData.id);
          if (!role) continue;

          client.log(newM.guild, new EmbedBuilder()
            .setColor("#e74c3c")
            .setAuthor({
              name: user.tag,
              iconURL: user.displayAvatarURL({ size: 32 })
            })
            .setDescription(`**Role removed**\n${role}`)
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp()
          );
        }
      }
    }
  }
};