module.exports = {
  name: "stageInstanceDelete",
  execute(stage, client) {
    client.log(stage.guild, {
      description: "🛑 Stage Ended"
    });
  }
};