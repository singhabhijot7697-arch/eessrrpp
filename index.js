require("dotenv").config();
const fs = require("fs");
const express = require("express");
const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");

// ✅ WEB SERVER (Render)
const app = express();
app.get("/", (req, res) => res.send("OK"));
app.listen(3000, () => console.log("🌐 Web running"));

// ✅ CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Message, Partials.Channel]
});

// ✅ COLLECTIONS
client.commands = new Collection();

// ✅ DATA
client.configs = require("./data/config.json");
client.words = require("./data/words.json");
client.cases = require("./data/cases.json");

// ✅ SYSTEM STORAGE
client.warns = {};
client.modLogs = {};
client.statusList = [
  { type: 0, text: "Eight Streets RolePlay" }
];

// ✅ CONFIG
client.getConfig = (id) => {
  if (!client.configs[id]) {
    client.configs[id] = {
      logChannel: null,
      whitelist: [],
      logsEnabled: true
    };
  }
  return client.configs[id];
};

// ✅ CASE SYSTEM
client.addCase = (gid, data) => {
  if (!client.cases[gid]) client.cases[gid] = [];

  const id = client.cases[gid].length + 1;

  client.cases[gid].push({
    id,
    ...data,
    time: new Date()
  });

  fs.writeFileSync("./data/cases.json", JSON.stringify(client.cases, null, 2));

  return id;
};

// ✅ MOD LOG (CHANNEL + OWNER DM)
client.modLog = async (guild, embed) => {

  const chId = client.modLogs[guild.id];
  if (chId) {
    const ch = guild.channels.cache.get(chId);
    if (ch) ch.send({ embeds: [embed] }).catch(()=>{});
  }

  try {
    const owner = await guild.client.users.fetch(process.env.OWNER_ID);
    await owner.send({ embeds: [embed] }).catch(()=>{});
  } catch {}
};

// ✅ SET MOD LOG CHANNEL
client.setModLog = (gid, cid) => {
  client.modLogs[gid] = cid;
};

// ✅ LOAD COMMANDS
fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  if (cmd.data) client.commands.set(cmd.data.name, cmd);
});

// ✅ SLASH COMMAND HANDLER (FIXED)
client.on("interactionCreate", async (interaction) => {

  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    console.error(err);

    if (!interaction.replied && !interaction.deferred) {
      interaction.reply({ content: "❌ Error", ephemeral: true });
    }
  }
});

// ✅ LOAD EVENTS
fs.readdirSync("./events").forEach(file => {
  const ev = require(`./events/${file}`);
  client.on(ev.name, (...args) => ev.execute(...args, client));
});

// ✅ READY + ROTATING STATUS
client.on("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  let i = 0;

  setInterval(() => {

    if (!client.statusList.length) return;

    const s = client.statusList[i % client.statusList.length];

    if (!s || typeof s.text !== "string") return;

    client.user.setPresence({
      activities: [{
        name: s.text,
        type: s.type || 0
      }],
      status: "online"
    });

    i++;

  }, 10000);
});

// ✅ ERROR HANDLING
process.on("unhandledRejection", err => console.error("❌ Unhandled:", err));
process.on("uncaughtException", err => console.error("❌ Crash:", err));

// ✅ LOGIN
console.log("🔑 Logging in...");
client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login success"))
  .catch(err => console.error("❌ Login failed:", err.message));