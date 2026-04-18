module.exports = {
  name: "messageReactionAdd",
  execute(reaction, user, client) {
    if (user.bot) return;

    client.log(reaction.message.guild, {
      description: "➕ Reaction Added",
      fields: [
        { name: "User", value: user.tag },
        { name: "Emoji", value: reaction.emoji.toString() },
        { name: "Message", value: reaction.message.content || "None" }
      ]
    });
  }
};