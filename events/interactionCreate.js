module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        interaction.followUp({ content: "❌ Error executing command", ephemeral: true });
      } else {
        interaction.reply({ content: "❌ Error executing command", ephemeral: true });
      }
    }
  }
};