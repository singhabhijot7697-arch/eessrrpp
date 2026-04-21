const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botstatus")
    .setDescription("Set rotating bot status")

    .addIntegerOption(o =>
      o.setName("type1")
        .setDescription("Type 1 (0-3)")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("text1")
        .setDescription("Text 1")
        .setRequired(true)
    )

    .addIntegerOption(o =>
      o.setName("type2")
        .setDescription("Type 2")
    )
    .addStringOption(o =>
      o.setName("text2")
        .setDescription("Text 2")
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ flags: 64 });

    if (interaction.user.id !== process.env.OWNER_ID) {
      return interaction.editReply({ content: "❌ Owner only" });
    }

    const t1 = interaction.options.getInteger("type1");
    const s1 = interaction.options.getString("text1");

    const t2 = interaction.options.getInteger("type2");
    const s2 = interaction.options.getString("text2");

    client.statusList = [
      { type: t1, text: s1 }
    ];

    if (t2 !== null && s2) {
      client.statusList.push({ type: t2, text: s2 });
    }

    await interaction.editReply({
      content: "✅ Status rotation updated"
    });
  }
};