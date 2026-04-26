const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupverification")
    .setDescription("Setup verification system"), 

  async execute(i, client) {

    const role = await i.guild.roles.create({ name: "Unverified" });
    const verified = await i.guild.roles.create({ name: "Verified" });

    const ch = await i.guild.channels.create({ name: "verify" });

    client.verifyConfig[i.guild.id] = {
      unverified: role.id,
      verified: verified.id,
      channel: ch.id
    };

    i.reply("✅ Verification setup complete");
  }
};