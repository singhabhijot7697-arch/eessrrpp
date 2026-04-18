const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  execute(member, client) {

    // ✅ ACCOUNT AGE
    const created = member.user.createdAt;
    const now = new Date();

    const months = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(((now - created) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor(((now - created) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const ageString = `${months} month${months !== 1 ? "s" : ""}, ${days} day${days !== 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`;

    // ✅ EMBED
    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ size: 32 })
      })
      .setDescription("**Member joined**")
      .addFields(
        {
          name: "\u200B",
          value: `${member} **${member.guild.memberCount}th** to join`
        },
        {
          name: "\u200B",
          value: `created **${ageString}**`
        }
      )
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();

    client.log(member.guild, embed);
  }
};