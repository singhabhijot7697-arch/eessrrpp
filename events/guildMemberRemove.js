const { EmbedBuilder } = require("discord.js");

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const units = [
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

  return out.join(", ");
}

module.exports = {
  name: "guildMemberRemove",

  execute(member, client) {

    const now = Date.now();

    const joinedDiff = member.joinedTimestamp
      ? formatDuration(now - member.joinedTimestamp)
      : "Unknown";

    const joinedTS = member.joinedTimestamp
      ? `<t:${Math.floor(member.joinedTimestamp/1000)}:F>`
      : "Unknown";

    const roles = member.roles.cache
      .filter(r => r.id !== member.guild.id)
      .map(r => r.toString())
      .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ size: 32 })
      })
      .setDescription("Member left")
      .addFields(
        {
          name: "\u200B",
          value: `${member} joined ${joinedTS}\n(${joinedDiff} ago)`
        },
        { name: "Roles", value: roles }
      )
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();

    client.log(member.guild, embed);
  }
};