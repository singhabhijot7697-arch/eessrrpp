module.exports = {
  name: "emojiDelete",
  execute(emoji, client) {
    client.log(emoji.guild, {
      description: "❌ Emoji Deleted",
      fields: [{ name: "Name", value: emoji.name }]
    });
  }
};