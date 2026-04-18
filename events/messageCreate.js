module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    const config = client.getConfig(message.guild.id);

    // ✅ whitelist
    const isWhitelisted =
      config.whitelist.includes(message.author.id) ||
      message.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (isWhitelisted) return;

    const content = message.content.toLowerCase();

    // =========================
    // 🔗 LINK BLOCK
    // =========================
    const linkRegex = /(https?:\/\/|discord\.gg|www\.|\.com|\.net|\.org)/i;

    if (linkRegex.test(content)) {
      await message.delete().catch(()=>{});
      await message.member.timeout(2 * 60 * 60 * 1000).catch(()=>{});

      // ✅ DM with server name
      await message.author.send(
        `🚫 You have been muted for 2 hours in **${message.guild.name}**.\n\nReason: Sending links is not allowed.`
      ).catch(()=>{});

      // ✅ clean log
      client.log(message.guild, {
        color: 0xe74c3c,
        author: {
          name: message.author.tag,
          icon_url: message.author.displayAvatarURL()
        },
        description: "**User muted (Link)**",
        fields: [
          { name: "Channel", value: `${message.channel}` },
          { name: "Content", value: message.content }
        ],
        footer: { text: `ID: ${message.author.id}` },
        timestamp: new Date()
      });

      return;
    }

    // =========================
    // 🚫 ABUSE FILTER
    // =========================

    const clean = content.replace(/[^a-z0-9\u0900-\u097F\s]/gi, "");

    const found = client.words.find(word => clean.includes(word));
    if (!found) return;

    // ✅ delete + mute
    await message.delete().catch(()=>{});
    await message.member.timeout(2 * 60 * 60 * 1000).catch(()=>{});

    // ✅ DM
    await message.author.send(
      `🚫 You have been muted for 2 hours in **${message.guild.name}**.\n\nReason: Abusive language detected.`
    ).catch(()=>{});

    // ✅ clean log
    client.log(message.guild, {
      color: 0xe74c3c,
      author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL()
      },
      description: "**User muted (Abuse)**",
      fields: [
        { name: "Word", value: found },
        { name: "Channel", value: `${message.channel}` }
      ],
      footer: { text: `ID: ${message.author.id}` },
      timestamp: new Date()
    });

    // ✅ case
    client.addCase(message.guild.id, {
      user: message.author.id,
      action: "ABUSE",
      reason: found
    });
  }
};