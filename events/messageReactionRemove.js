module.exports = {
  name: "messageReactionRemove",
  execute(reaction, user, client) {
    if (user.bot) return;

    client.log(reaction.message.guild, {
      description: "➖ Reaction Removed",
      fields: [
        { name: "User", value: user.tag },
        { name: "Emoji", value: reaction.emoji.toString() }
      ]
    });
  }
};