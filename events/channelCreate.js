const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
  name: "channelCreate",

  async execute(channel, client) {

    let executor;
    try {
      const logs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.ChannelCreate
      });
      executor = logs.entries.first()?.executor;
    } catch {}

    // ✅ BASE INFO
    let desc = `Text channel created\n`;

    desc += `Name: ${channel.name}\n`;
    desc += `Category: ${channel.parent ? channel.parent.name : "None"}\n`;

    // ✅ PERMISSION OVERWRITES
    const overwrites = channel.permissionOverwrites.cache;

    overwrites.forEach(perm => {

      const target =
        channel.guild.roles.cache.get(perm.id) ||
        channel.guild.members.cache.get(perm.id);

      if (!target) return;

      const type = channel.guild.roles.cache.has(perm.id)
        ? `Role override for ${target}`
        : `Member override for ${target.user?.tag || target}`;

      desc += `${type}\n`;

      const allow = perm.allow.toArray();
      const deny = perm.deny.toArray();

      const perms = new Set([...allow, ...deny]);

      perms.forEach(p => {
        const value = allow.includes(p) ? "✅" : "❌";

        desc += `${formatPerm(p)}: ${value}\n`;
      });
    });

    // ✅ EMBED
    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setAuthor({
        name: executor ? executor.tag : "Unknown",
        iconURL: executor?.displayAvatarURL({ size: 32 })
      })
      .setDescription(desc)
      .setFooter({ text: `Channel ID: ${channel.id}` })
      .setTimestamp();

    client.log(channel.guild, embed);
  }
};

// ✅ FORMAT PERMISSION NAME
function formatPerm(perm) {
  return perm
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}