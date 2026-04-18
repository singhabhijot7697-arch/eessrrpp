module.exports = {
  name: "threadCreate",
  execute(thread, client) {
    client.log(thread.guild, {
      description: "🧵 Thread Created",
      fields: [{ name: "Name", value: thread.name }]
    });
  }
};