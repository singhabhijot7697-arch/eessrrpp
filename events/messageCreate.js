const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    const config = client.getConfig(message.guild.id);

    // ✅ WHITELIST CHECK
    const allowed =
      message.author.id === process.env.OWNER_ID ||
      config.whitelist.includes(message.author.id) ||
      message.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (allowed) return;

    const content = message.content.toLowerCase();

    // ✅ LINK BLOCK (ALLOW GIF)
    if (/(https?:\/\/|discord\.gg|www\.)/.test(content) && !content.match(/\.gif$/)) {
      return punish(message, client, "LINK");
    }

    // ✅ ABUSE WORDS
    const clean = content.replace(/[^a-z0-9\s]/gi, "");
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

  const n = data.count;

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

  // ✅ BAN (5th)
  if (n >= 5) {

    await message.guild.members.ban(uid).catch(()=>{});

    // ✅ DM USER
    await message.author.send(
      `🚫 You have been **banned** from **${message.guild.name}**.\nReason: ${reasonText}\n(5/5 warnings)`
    ).catch(()=>{});

    // ✅ LOG EMBED
    const embed = new EmbedBuilder()
      .setColor("#e74c3c")
      .setTitle("User banned (5/5)")
      .addFields(
        { name: "User", value: message.author.tag },
        { name: "Reason", value: reasonText },
        { name: "Server", value: message.guild.name }
      )
      .setFooter({ text: `ID: ${uid}` })
      .setTimestamp();

    await client.ownerLogEmbed(client, embed, message.guild);

    delete client.warns[gid][uid];
    return;
  }

  // ✅ MUTE (1–4)
  const duration = durations[n];

  await message.member.timeout(duration).catch(()=>{});

  // ✅ DM USER
  await message.author.send(
    `⚠️ Warning ${n}/5 in **${message.guild.name}**\nMuted for ${format(duration)}\nReason: ${reasonText}`
  ).catch(()=>{});

  // ✅ LOG EMBED
  const embed = new EmbedBuilder()
    .setColor("#e67e22")
    .setTitle("User muted")
    .addFields(
      { name: "User", value: message.author.tag },
      { name: "Reason", value: reasonText },
      { name: "Duration", value: format(duration) },
      { name: "Warnings", value: `${n}/5` }
    )
    .setFooter({ text: `ID: ${uid}` })
    .setTimestamp();

  await client.ownerLogEmbed(client, embed, message.guild);
}

// ✅ FORMAT TIME
function format(ms){
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);

  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}