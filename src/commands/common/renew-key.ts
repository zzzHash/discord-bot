import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/type/command";
import axios from "axios";

export default new Command({
  name: "renovar-key",
  description: "Renovar uma key",
  defaultMemberPermissions: "Administrator",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Valor da chave que será deletada",
      type: 3,
      required: true,
    },
    {
      name: "duração_da_chave",
      description: "Duração da chave",
      type: 3,
      required: true,
    },
  ],
  async run({ interaction }) {
    if (!interaction.inCachedGuild()) return;

    const code = interaction.options.get("key")?.value;
    const code_duration = interaction.options.get("duração_da_chave")?.value;

    const res = await axios({
      url: `http://${process.env.BACKEND_URL}/codes`,
      method: "PATCH",
      headers: {
        auth: process.env.AUTH_KEY_HEADER,
      },
      data: {
        code,
        code_duration: Number(code_duration),
      },
    });

    const { data, status } = res;

    console.log(data);
    console.log(status);

    await interaction.reply({
      content: "Chave renovada com sucesso!",
      ephemeral: true,
    });
  },
});
