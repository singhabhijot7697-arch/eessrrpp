const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "inviteCreate",
  execute(invite, client) {

    const embed = new EmbedBuilder()
      .setColor("#00bcd4") // 🔗 cyan
      .setAuthor({
        name: invite.inviter ? invite.inviter.tag : "Unknown",
        iconURL: invite.inviter?.displayAvatarURL({ size: 32 })
      })
      .setDescription("Invite created")
      .addFields(
        { name: "Code", value: invite.code },
        { name: "Channel", value: `${invite.channel}` },
        { name: "Uses", value: invite.maxUses ? invite.maxUses.toString() : "Unlimited" },
        { name: "Expires", value: invite.maxAge ? `${invite.maxAge}s` : "Never" }
      )
      .setFooter({ text: `Invite URL: discord.gg/${invite.code}` })
      .setTimestamp();

    client.log(invite.guild, embed);
  }
};