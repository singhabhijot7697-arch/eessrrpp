const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (!message.guild || message.author.bot) return;

    const config = client.getConfig(message.guild.id);

    // ✅ WHITELIST
    const isWL =
      message.author.id === process.env.OWNER_ID ||
      config.whitelist.includes(message.author.id) ||
      message.member.roles.cache.some(r => config.whitelist.includes(r.id));

    if (isWL) return;

    const content = message.content.toLowerCase();

    // ✅ LINK BLOCK (ALLOW GIF)
    if (/(https?:\/\/|discord\.gg|www\.)/.test(content) && !content.match(/\.gif$/)) {
      return punish(message, client, "LINK");
    }

    // ✅ ABUSE
    const clean = content.replace(/[^a-z0-9\s]/gi, "");
    const found = client.words.find(w => clean.includes(w));

    if (found) {
      return punish(message, client, "ABUSE", found);
    }
  }
};

// ✅ PUNISH SYSTEM
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

  const warn = data.count;

  await message.delete().catch(()=>{});

  const punishments = {
    1: 30 * 60 * 1000,
    2: 2 * 60 * 60 * 1000,
    3: 24 * 60 * 60 * 1000,
    4: 7 * 24 * 60 * 60 * 1000
  };

  // ✅ BAN
  if (warn >= 5) {
    await message.guild.members.ban(uid).catch(()=>{});

    await message.author.send(
      `🚫 You have been banned from **${message.guild.name}** (5 warnings).`
    ).catch(()=>{});

    delete client.warns[gid][uid];
    return;
  }

  // ✅ TIMEOUT
  const duration = punishments[warn];
  await message.member.timeout(duration).catch(()=>{});

  const next = {
    1: "Next: 2h mute",
    2: "Next: 24h mute",
    3: "Next: 7d mute",
    4: "Next: BAN"
  };

  await message.author.send(
    `⚠️ Warning ${warn}/5 in **${message.guild.name}**\n\n` +
    `Muted for ${format(duration)}\n` +
    `${next[warn]}`
  ).catch(()=>{});

  client.log(message.guild, new EmbedBuilder()
    .setColor("#e67e22")
    .setDescription(`User punished (${warn}/5)`)
    .addFields({ name: "User", value: message.author.tag })
    .setFooter({ text: `ID: ${uid}` })
    .setTimestamp()
  );
}

// ✅ FORMAT TIME
function format(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);

  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}