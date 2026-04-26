const { EmbedBuilder } = require("discord.js");

// ✅ duration function
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

  async execute(member, client) {

    const cfg = client.verifyConfig[member.guild.id];

    // ✅ ADD UNVERIFIED ROLE
    if (cfg) {
      await member.roles.add(cfg.unverified).catch(()=>{});
    }

    const now = Date.now();
    const createdDiff = formatDuration(now - member.user.createdTimestamp);

    client.log(member.guild, new EmbedBuilder()
      .setColor("#2ecc71")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ size: 32 })
      })
      .setDescription("Member joined")
      .addFields(
        { name: "\u200B", value: `${member} ${member.guild.memberCount}th to join` },
        { name: "\u200B", value: `created ${createdDiff} ago` },
        { name: "ID", value: member.id }
      )
      .setTimestamp()
    );
  }
};