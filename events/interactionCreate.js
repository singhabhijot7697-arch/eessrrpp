module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {

    // ✅ SLASH COMMANDS
    if (interaction.isChatInputCommand()) {

      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return;

      try {
        await cmd.execute(interaction, client);
      } catch (err) {
        console.error(err);
        if (!interaction.replied) {
          interaction.reply({ content: "❌ Error", ephemeral: true });
        }
      }
    }

    // ✅ VERIFICATION BUTTON
    if (interaction.isButton()) {

      if (interaction.customId === "verify_btn") {

        const cfg = client.verifyConfig[interaction.guild.id];
        if (!cfg) return;

        const member = interaction.member;

        await member.roles.remove(cfg.unverified).catch(()=>{});
        await member.roles.add(cfg.verified).catch(()=>{});

        await interaction.reply({ content: "✅ Verified!", ephemeral: true });

        // ✅ LOG
        client.log(interaction.guild, {
          description: "User verified",
          fields: [{ name: "User", value: interaction.user.tag }]
        });
      }
    }
  }
};