const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove timeout")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User to untimeout") // ✅ FIX
        .setRequired(true)
    ),

  async execute(i) {
    await i.deferReply({ flags: 64 });

    const user = i.options.getUser("user");

    const member = await i.guild.members.fetch(user.id);

    await member.timeout(null).catch(()=>{});

    await user.send(`✅ Timeout removed`).catch(()=>{});

    await i.editReply("✅ Timeout removed");
  }
};