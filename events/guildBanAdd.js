const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildBanAdd",
  async execute(ban, client) {
    const executor = await client.getExecutor(ban.guild, AuditLogEvent.MemberBanAdd);

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setAuthor({
        name: `${ban.guild.name} | ${executor ? executor.tag : "Unknown"}`
      })
      .setDescription("🔨 User banned")
      .addFields(
        { name: "User", value: `${ban.user.tag}` },
        { name: "ID", value: ban.user.id }
      )
      .setTimestamp();

    client.log(ban.guild, embed);
  }
};