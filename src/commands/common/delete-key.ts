import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/type/command";
import axios from "axios";
import "dotenv";

export default new Command({
  name: "deletar-key",
  description: "Delete uma key",
  defaultMemberPermissions: "Administrator",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Valor da chave que será deletada",
      type: 3,
      required: true,
    },
  ],
  async run({ interaction }) {
    if (!interaction.inCachedGuild()) return;

    const code_value = interaction.options.get("key")?.value;

    await axios({
      url: `http://${process.env.BACKEND_URL}/codes`,
      headers: {
        auth: process.env.AUTH_KEY_HEADER,
      },
      data: {
        codes: [code_value],
      },
    });

    await interaction.reply({
      fetchReply: true,
      ephemeral: true,
      content: "Chave deletada com sucesso",
    });
  },
});
