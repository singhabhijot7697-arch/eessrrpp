const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    const config = client.getConfig(message.guild.id);

    const userId = message.author.id;
    const content = message.content;

    // ✅ WHITELIST USER / ROLE
    const isWhitelisted =
      message.author.id === process.env.OWNER_ID ||
      config.whitelist.includes(message.author.id) ||
      message.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (isWhitelisted) return;

    // =========================
    // ✅ IGNORE EMOJI ONLY
    // =========================
    if (/^[\p{Emoji}\s]+$/u.test(content)) return;

    // =========================
    // ✅ IGNORE GIF ATTACHMENTS
    // =========================
    if (message.attachments.size > 0) {
      const att = message.attachments.first();
      if (att.contentType?.includes("gif")) return;
    }

    // =========================
    // ✅ IGNORE GIF LINKS
    // =========================
    if (content.match(/\.(gif)$/i)) return;

    // =========================
    // ✅ LINK DETECTION
    // =========================
    const linkRegex = /(https?:\/\/|discord\.gg|www\.)/i;

    if (linkRegex.test(content)) {
      return punish(message, client, "LINK");
    }

    // =========================
    // ✅ ABUSE FILTER
    // =========================
    const clean = content.toLowerCase().replace(/[^a-z0-9\s]/gi, "");

    const found = client.words.find(w => clean.includes(w));

    if (found) {
      return punish(message, client, "ABUSE", found);
    }
  }
};

// ✅ ✅ PUNISH SYSTEM
async function punish(message, client, type, word = null) {

  const gid = message.guild.id;
  const uid = message.author.id;

  if (!client.warns[gid]) client.warns[gid] = {};
  if (!client.warns[gid][uid]) {
    client.warns[gid][uid] = { count: 0, last: Date.now() };
  }

  const data = client.warns[gid][uid];

  // ✅ RESET AFTER 30 DAYS
  if (Date.now() - data.last > 30 * 24 * 60 * 60 * 1000) {
    data.count = 0;
  }

  data.count++;
  data.last = Date.now();

  const warnCount = data.count;

  await message.delete().catch(()=>{});

  const durations = {
    1: 30 * 60 * 1000,
    2: 2 * 60 * 60 * 1000,
    3: 24 * 60 * 60 * 1000,
    4: 7 * 24 * 60 * 60 * 1000
  };

  const reasonText =
    type === "LINK"
      ? "Sending links is not allowed."
      : `Abusive language${word ? ` ("${word}")` : ""}.`;

  // ✅ BAN (5th warn)
  if (warnCount >= 5) {

    await message.guild.members.ban(uid).catch(()=>{});

    await message.author.send(
      `🚫 You have been banned from **${message.guild.name}**\nReason: ${reasonText}\n(5/5 warnings)`
    ).catch(()=>{});

    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setTitle("ban")
      .addFields(
        { name: "User", value: message.author.tag },
        { name: "Reason", value: reasonText }
      )
      .setFooter({ text: `ID: ${uid}` })
      .setTimestamp();

    await client.modLog(message.guild, embed);

    delete client.warns[gid][uid];
    return;
  }

  // ✅ MUTE (1–4)
  const duration = durations[warnCount];

  await message.member.timeout(duration).catch(()=>{});

  await message.author.send(
    `⚠️ Warning ${warnCount}/5 in **${message.guild.name}**\nReason: ${reasonText}`
  ).catch(()=>{});

  const embed = new EmbedBuilder()
    .setColor("#e67e22")
    .setTitle("timeout")
    .addFields(
      { name: "User", value: message.author.tag },
      { name: "Reason", value: reasonText },
      { name: "Warnings", value: `${warnCount}/5` }
    )
    .setFooter({ text: `ID: ${uid}` })
    .setTimestamp();

  await client.modLog(message.guild, embed);
}