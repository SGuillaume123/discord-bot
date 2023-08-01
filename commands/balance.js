const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Shows a user their rizzcoin balance"),
  async execute(interaction, profileData) {
    const { rizzCoins } = profileData;
    const username = interaction.user.username;
    await interaction.reply(`${username} has ${rizzCoins} rizzcoins`);
  },
};
