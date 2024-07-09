import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import { Command } from "../../structs/type/command";

export default new Command({
  name: "embed",
  description: "aaaaaa!",
  type: ApplicationCommandType.ChatInput,
  run({ interaction }) {
    const embed = new EmbedBuilder({
      title: "Title",
      description: "Description",
      thumbnail: {
        url: "https://github.com/zzzHash.png",
        height: 50,
        width: 50,
      },
      fields: [
        {
          name: "Field 1",
          value: "Value 1",
        },
      ],
    });

    interaction.reply({
      ephemeral: true,
      embeds: [embed],
    });
  },
});
