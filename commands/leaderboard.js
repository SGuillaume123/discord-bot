const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the top 10 richest members"),
  async execute(interaction, profileData) {
    await interaction.deferReply();

    const { username, id } = interaction.user;
    const { rizzCoins } = profileData;

    let leaderboardEmbed = new EmbedBuilder()
      .setTitle("**Top 10 coin earners**")
      .setColor(0x45d6fd)
      .setFooter({ text: "You are not ranked yet" });

    const members = await profileModel
      .find()
      .sort({ rizzCoins: -1 })
      .catch((err) => console.log(err));

    const memberIdx = members.findIndex((member) => member.userId === id);
    leaderboardEmbed.setFooter({
      text: `${username}, you are rank #${
        memberIdx + 1
      } with ${rizzCoins} coins`,
    });

    const topTen = members.slice(0, 10);

    let desc = "";
    for (let i = 0; i < topTen.length; i++) {
      let { user } = await interaction.guild.members.fetch(topTen[i].userId);
      if (!user) return;
      let userBalance = topTen[i].rizzCoins;
      desc += `**${i + 1}. ${user.username}:** ${userBalance} coins\n`;
    }
    if (desc !== "") {
      leaderboardEmbed.setDescription(desc);
    }

    await interaction.editReply({ embeds: [leaderboardEmbed] });
  },
};
