module.exports = {
  name: "threadUpdate",
  execute(oldT, newT, client) {
    if (oldT.name !== newT.name) {
      client.log(newT.guild, {
        description: "✏️ Thread Updated",
        fields: [{ name: "Name", value: `${oldT.name} → ${newT.name}` }]
      });
    }
  }
};