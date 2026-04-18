module.exports = {
  name: "guildUpdate",
  execute(oldG, newG, client) {

    if (oldG.name !== newG.name) {
      client.log(newG, {
        description: `Server updated\n${oldG.name} → ${newG.name}`
      });
    }
  }
};