module.exports = {
  name: "stageInstanceCreate",
  execute(stage, client) {
    client.log(stage.guild, {
      description: "🎤 Stage Started",
      fields: [{ name: "Topic", value: stage.topic }]
    });
  }
};