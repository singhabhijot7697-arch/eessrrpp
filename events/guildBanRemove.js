module.exports = {
  name: "guildBanRemove",
  execute(ban, client) {

    client.log(ban.guild, {
      description: `User unbanned\n${ban.user.tag}`,
      fields: [{ name: "ID", value: ban.user.id }]
    });
  }
};