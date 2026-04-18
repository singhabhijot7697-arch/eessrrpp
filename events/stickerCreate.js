module.exports = {
  name: "stickerCreate",
  execute(sticker, client) {
    client.log(sticker.guild, {
      description: "🆕 Sticker Created",
      fields: [{ name: "Name", value: sticker.name }]
    });
  }
};