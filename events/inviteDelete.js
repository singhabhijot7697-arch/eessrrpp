module.exports = {
  name: "inviteDelete",
  execute(invite, client) {
    client.log(invite.guild, {
      description: "❌ Invite Deleted",
      fields: [{ name: "Code", value: invite.code }]
    });
  }
};