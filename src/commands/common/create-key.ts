import {
  ApplicationCommandType,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../../structs/type/command";
import axios from "axios";
import "dotenv";

export default new Command({
  name: "criar-chave",
  description: "Criar uma key passando a duração",
  defaultMemberPermissions: "Administrator",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "duração_da_chave",
      description: "Tempo que ira durar a chave",
      type: 3,
      required: true,
    },
  ],
  async run({ interaction }) {
    if (!interaction.inCachedGuild()) return;

    const key_duration = Number(
      interaction.options.get("duração_da_chave")?.value
    );

    const response = await axios({
      url: `http://${process.env.BACKEND_URL}/codes`,
      method: "POST",
      headers: {
        auth: process.env.AUTH_KEY_HEADER,
      },
      data: {
        code_duration: key_duration,
      },
    });

    const { data, status } = response;

    if (status === 201) {
      const embed = new EmbedBuilder({
        title: "Chave criada com sucesso",
        description: data.code,
      }).setColor("#8d46ff" as ColorResolvable);

      await interaction.reply({
        fetchReply: true,
        embeds: [embed],
      });
    } else {
      await interaction.reply({
        fetchReply: true,
        ephemeral: true,
        content: "Ocorreu um erro ao criar a chave",
      });
    }
  },
});
