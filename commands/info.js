const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// ✅ duration formatter
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);

  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  let result = [];
  let remaining = seconds;

  for (const [name, value] of units) {
    const count = Math.floor(remaining / value);
    if (count > 0) {
      result.push(`${count} ${name}${count > 1 ? "s" : ""}`);
      remaining %= value;
    }
  }

  return result.slice(0, 4).join(", ");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Show user info")
    .addUserOption(o =>
      o.setName("user")
        .setDescription("User")
    ),

  async execute(interaction, client) {

    await interaction.deferReply({ flags: 64 });

    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const now = Date.now();

    // ✅ TIMES
    const createdDate = new Date(user.createdTimestamp).toISOString().replace("T", " ").split(".")[0] + " UTC";
    const createdDiff = formatDuration(now - user.createdTimestamp);

    const joinedDate = new Date(member.joinedTimestamp).toISOString().replace("T", " ").split(".")[0] + " UTC";
    const joinedDiff = formatDuration(now - member.joinedTimestamp);

    const serverDiff = formatDuration(member.joinedTimestamp - interaction.guild.createdTimestamp);

    // ✅ ROLES
    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString())
      .join(" ") || "None";

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ size: 32 })
      })
      .setDescription("Avatar")
      .addFields(
        { name: "Roles", value: roles },
        {
          name: "Created at",
          value: `${createdDate}\n(${createdDiff} ago)`
        },
        {
          name: "Joined at",
          value:
            `${joinedDate}\n` +
            `(${joinedDiff} ago)\n` +
            `${serverDiff} after the server was created`
        }
      )
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};