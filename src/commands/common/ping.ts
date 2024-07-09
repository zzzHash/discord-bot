import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/type/command";

export default new Command({
  name: "ping",
  description: "Replies with Pong!",
  type: ApplicationCommandType.ChatInput,
  run({ interaction }) {
    interaction.reply({ ephemeral: true, content: "Pong!" });
  },
});
