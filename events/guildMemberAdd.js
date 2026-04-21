function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);

  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  let result = [];
  let remaining = seconds;

  for (const [name, value] of units) {
    const count = Math.floor(remaining / value);
    if (count > 0) {
      result.push(`${count} ${name}${count > 1 ? "s" : ""}`);
      remaining %= value;
    }
  }

  return result.slice(0, 3).join(", ");
}

const { EmbedBuilder } = require("discord.js");

// ✅ time formatter
function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
  ];

  let out = [];
  let rem = s;

  for (const [name, val] of units) {
    const c = Math.floor(rem / val);
    if (c > 0) {
      out.push(`${c} ${name}${c > 1 ? "s" : ""}`);
      rem %= val;
    }
  }

  return out.slice(0, 3).join(", ");
}

module.exports = {
  name: "guildMemberAdd",

  execute(member, client) {

    const now = Date.now();

    const createdDiff = formatDuration(now - member.user.createdTimestamp);

    const createdTS = `<t:${Math.floor(member.user.createdTimestamp/1000)}:F>`;

    // ✅ NEW ACCOUNT DETECT (<7 days)
    const isNew = (now - member.user.createdTimestamp) < (7 * 24 * 60 * 60 * 1000);

    const embed = new EmbedBuilder()
      .setColor(isNew ? "#e74c3c" : "#2ecc71") // 🔴 red if new
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ size: 32 })
      })
      .setDescription(`Member joined`)
      .addFields(
        {
          name: "\u200B",
          value: `${member} ${member.guild.memberCount}th to join`
        },
        {
          name: "\u200B",
          value: `${createdTS}\n(${createdDiff} ago)`
        }
      )
      .setFooter({
        text: `ID: ${member.id}${isNew ? " • ⚠️ New Account" : ""}`
      })
      .setTimestamp();

    client.log(member.guild, embed);
  }
};