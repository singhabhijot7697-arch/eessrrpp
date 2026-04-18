require("dotenv").config();
const fs = require("fs");
const express = require("express");
const { Client, GatewayIntentBits, Collection, Partials, AuditLogEvent } = require("discord.js");

// ✅ WEB SERVER
const app = express();
app.get("/", (req, res) => res.send("✅ Bot Alive"));
app.listen(3000, () => console.log("🌐 Web running"));

// ✅ DEBUG
console.log("🔍 TOKEN exists:", !!process.env.TOKEN);

// ✅ CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.User
  ]
});

client.commands = new Collection();

// ✅ LOAD DATA SAFELY
try { client.configs = require("./data/config.json"); } catch { client.configs = {}; }
try { client.words = require("./data/words.json"); } catch { client.words = []; }
try { client.cases = require("./data/cases.json"); } catch { client.cases = {}; }

// ✅ CONFIG SYSTEM
client.getConfig = (guildId) => {
  if (!client.configs[guildId]) {
    client.configs[guildId] = { logChannel: null, whitelist: [] };
  }
  return client.configs[guildId];
};

client.saveConfig = () => {
  fs.writeFileSync("./data/config.json", JSON.stringify(client.configs, null, 2));
};

// ✅ CASE SYSTEM
client.addCase = (guildId, data) => {
  if (!client.cases[guildId]) client.cases[guildId] = [];
  const id = client.cases[guildId].length + 1;
  client.cases[guildId].push({ id, ...data, time: new Date() });
  fs.writeFileSync("./data/cases.json", JSON.stringify(client.cases, null, 2));
};

// ✅ UNIVERSAL LOG FUNCTION
client.log = async (guild, data) => {
  const config = client.getConfig(guild.id);
  if (!config.logChannel) return;
  const ch = guild.channels.cache.get(config.logChannel);
  if (!ch) return;
  try {
    await ch.send({ embeds: [data] });
  } catch (err) {
    console.error("Log Error:", err.message);
  }
};

// ✅ EXECUTOR SYSTEM
client.getExecutor = async (guild, type) => {
  try {
    const logs = await guild.fetchAuditLogs({ limit: 1, type });
    return logs.entries.first()?.executor || null;
  } catch {
    return null;
  }
};

// ✅ LOAD COMMANDS
fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
  console.log(`✅ Command: ${cmd.data.name}`);
});

// ✅ LOAD EVENTS
fs.readdirSync("./events").forEach(file => {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`✅ Event: ${event.name}`);
});

// ✅ ERROR HANDLING
process.on("unhandledRejection", err => console.error("❌ Rejection:", err.message));
process.on("uncaughtException", err => console.error("❌ Exception:", err.message));

// ✅ LOGIN
console.log("🔑 Logging in...");
client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login successful"))
  .catch(err => console.error("❌ Login FAILED:", err.message));