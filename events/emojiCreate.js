module.exports = {
  name: "emojiCreate",
  execute(emoji, client) {

    client.log(emoji.guild, {
      description: `Emoji created\n:${emoji.name}:`,
      fields: [{ name: "ID", value: emoji.id }]
    });
  }
};