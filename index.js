require("dotenv").config();
const fs = require("fs");
const express = require("express");
const { 
  Client, 
  GatewayIntentBits, 
  Collection, 
  Partials 
} = require("discord.js");

// ✅ WEB SERVER (Render)
const app = express();
app.get("/", (req, res) => res.send("✅ Bot Alive"));
app.listen(3000, () => console.log("🌐 Web running"));

// ✅ CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember
  ]
});

client.commands = new Collection();

// ✅ DATA
client.configs = require("./data/config.json");
client.words = require("./data/words.json");
client.cases = require("./data/cases.json");

// ✅ WARN SYSTEM
client.warns = {};

// ✅ STATUS LIST
client.statusList = ["Eight Streets RolePlay"];

// ✅ CONFIG SYSTEM
client.getConfig = (guildId) => {
  if (!client.configs[guildId]) {
    client.configs[guildId] = {
      logChannel: null,
      whitelist: [],
      logsEnabled: true
    };
  }
  return client.configs[guildId];
};

client.saveConfig = () => {
  fs.writeFileSync("./data/config.json", JSON.stringify(client.configs, null, 2));
};

// ✅ LOG SYSTEM
client.log = async (guild, embed) => {
  const config = client.getConfig(guild.id);
  if (!config.logChannel || config.logsEnabled === false) return;

  const ch = guild.channels.cache.get(config.logChannel);
  if (!ch) return;

  ch.send({ embeds: [embed] }).catch(() => {});
};

// ✅ OWNER + CHANNEL EMBED LOG
client.ownerLogEmbed = async (client, embed, guild) => {
  try {
    const owner = await client.users.fetch(process.env.OWNER_ID);
    owner.send({ embeds: [embed] }).catch(()=>{});

    const config = client.getConfig(guild.id);
    if (config.logChannel && config.logsEnabled !== false) {
      const ch = guild.channels.cache.get(config.logChannel);
      if (ch) ch.send({ embeds: [embed] }).catch(()=>{});
    }
  } catch {}
};

// ✅ LOAD SLASH COMMANDS
fs.readdirSync("./commands").forEach(file => {
  const cmd = require(`./commands/${file}`);
  if (cmd.data) client.commands.set(cmd.data.name, cmd);
});

// ✅ SLASH HANDLER
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "❌ Error", ephemeral: true });
  }
});

// ✅ PREFIX COMMANDS (!info etc.)
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const cmd = client.commands.get(cmdName);
  if (!cmd) return;

  try {
    await cmd.execute(message, args, client);
  } catch (err) {
    console.error(err);
  }
});

// ✅ LOAD EVENTS
fs.readdirSync("./events").forEach(file => {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
});

// ✅ READY + ROTATING STATUS
client.on("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      activities: [{
        name: client.statusList[i % client.statusList.length],
        type: 0
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