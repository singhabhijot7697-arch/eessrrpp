module.exports = {
  name: "emojiUpdate",
  execute(oldE, newE, client) {
    if (oldE.name !== newE.name) {
      client.log(newE.guild, {
        description: "✏️ Emoji Updated",
        fields: [{ name: "Name", value: `${oldE.name} → ${newE.name}` }]
      });
    }
  }
};