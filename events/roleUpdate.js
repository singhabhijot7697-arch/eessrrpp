const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "roleUpdate",

  execute(oldR, newR, client) {

    const oldPerms = oldR.permissions.toArray();
    const newPerms = newR.permissions.toArray();

    const added = newPerms.filter(p => !oldPerms.includes(p));
    const removed = oldPerms.filter(p => !newPerms.includes(p));

    if (!added.length && !removed.length) return;

    const format = perm =>
      perm
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());

    let text = "";

    // ✅ bold section title
    text += `**New permissions**\n`;

    if (added.length) {
      text += `Added: ${added.map(format).join(", ")}\n`;
    }

    if (removed.length) {
      text += `Removed: ${removed.map(format).join(", ")}`;
    }

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")

      // ✅ BIG TITLE
      .setTitle(`Role "${newR.name}" updated`)

      // ✅ CLEAN BODY
      .setDescription(text)

      // ✅ SMALL FOOTER
      .setFooter({ text: `Role ID: ${newR.id}` })

      .setTimestamp();

    client.log(newR.guild, embed);
  }
};