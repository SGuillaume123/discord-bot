const { SlashCommandBuilder } = require("discord.js");
const { coinFlipReward } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin for a free bonus")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("head or tails")
        .setRequired(true)
        .addChoices(
          { name: "Heads", value: "Heads" },
          { name: "Tails", value: "Tails" }
        )
    ),
  async execute(interaction, profileData) {
    const { id } = interaction.user;
    const { coinflipLastUsed } = profileData;

    const cooldown = 3600000; //1 hour cooldown
    const timeLeft = cooldown - (Date.now() - coinflipLastUsed);

    if (timeLeft > 0) {
      await interaction.deferReply({ ephemeral: true });
      const { minutes, seconds } = parseMilliseconds(timeLeft);
      return await interaction.editReply(
        `Claim your next coinflip in ${minutes} min ${seconds} sec`
      );
    }

    await interaction.deferReply();

    await profileModel.findOneAndUpdate(
      {
        userId: id,
      },
      {
        $set: {
          coinflipLastUsed: Date.now(),
        },
      }
    );

    const randomNum = Math.round(Math.random()); //Automatically between 0 and 1
    const result = randomNum ? "Heads" : "Tails";
    const choice = interaction.options.getString("choice");

    if (choice === result) {
      await profileModel.findOneAndUpdate(
        {
          userId: id,
        },
        {
          $inc: {
            rizzCoins: coinFlipReward,
          },
        }
      );

      await interaction.editReply(
        `Winner! You won ${coinFlipReward} coins with **${choice}**`
      );
    } else {
      await interaction.editReply(
        `Lost... You chose **${choice}** but it was **${result}** Better luck next time`
      );
    }
  },
};
