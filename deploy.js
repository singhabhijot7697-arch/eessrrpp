require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");

const commands = [];

// ✅ LOAD COMMAND FILES
const files = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of files) {
  try {
    const cmd = require(`./commands/${file}`);

    // ✅ DEBUG (THIS WILL FIND ERROR FILE)
    const data = cmd.data.toJSON();

    commands.push(data);

  } catch (err) {
    console.log("❌ BROKEN COMMAND FILE:", file);
    console.error(err.message);
  }
}

// ✅ REGISTER COMMANDS
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🚀 Registering commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Commands registered successfully");

  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
})();