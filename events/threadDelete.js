module.exports = {
  name: "threadDelete",
  execute(thread, client) {
    client.log(thread.guild, {
      description: "❌ Thread Deleted",
      fields: [{ name: "Name", value: thread.name }]
    });
  }
};