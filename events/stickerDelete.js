module.exports = {
  name: "stickerDelete",
  execute(sticker, client) {
    client.log(sticker.guild, {
      description: "❌ Sticker Deleted",
      fields: [{ name: "Name", value: sticker.name }]
    });
  }
};