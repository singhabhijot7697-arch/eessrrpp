module.exports = {
  name: "inviteCreate",
  execute(invite, client) {

    client.log(invite.guild, {
      description: `Invite created\n${invite.code}`,
      fields: [{ name: "Channel", value: invite.channel.toString() }]
    });
  }
};