import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ColorResolvable,
  ComponentType,
  EmbedBuilder,
  Message,
} from "discord.js";
import { Command } from "../../structs/type/command";
import { setTimeout as wait } from "node:timers/promises";

const questions = [
  { id: "title", text: "Title", question: "Qual será o título do anúncio?" },
  {
    id: "description",
    text: "Description",
    question: "Qual será a descrição do anúncio?",
  },
  {
    id: "title_url",
    text: "Title Url",
    question: "Qual é o link do título do anúncio?",
  },
  {
    id: "side_image",
    text: "Side Image",
    question: "Qual é o link da imagem lateral do anúncio?",
  },
  {
    id: "field_title",
    text: "Field Title",
    question: "Qual é o título do campo?",
  },
  {
    id: "field_value",
    text: "Field Text",
    question: "Qual é o texto do campo?",
  },
];

export default new Command({
  name: "announcement",
  description: "Send an announcement",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if (!interaction.inCachedGuild()) return;

    const { member, channel } = interaction;

    if (channel?.type !== ChannelType.GuildText) {
      interaction.reply({
        content: "You can't use this command in this channel",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder({
      title: "Formulário de anúncio",
      description: "Preencha todos os campos para criar o anúncio",
    }).setColor("#8d46ff" as ColorResolvable);

    const message = await interaction.reply({
      fetchReply: true,
      embeds: [embed],
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              customId: "question-start-button",
              label: "Começar",
              style: ButtonStyle.Success,
            }),
          ],
        }),
      ],
    });

    const buttonInteraction = await message
      .awaitMessageComponent({
        componentType: ComponentType.Button,
      })
      .catch(() => null);

    if (!buttonInteraction) return;

    interface Answer {
      name: string;
      value: string;
    }

    const answers: Answer[] = [];
    const filter = (m: Message) => m.author.id == member.id;

    const quest = async (steps = 0) => {
      if (steps < questions.length) {
        const current = questions[steps];

        embed.setDescription(`> ${current.question}`).setFooter({
          text:
            `Pergunta ${steps + 1} de ${questions.length}` +
            "\nDigite cancelar a qualquer momento para cancelar!",
        });

        await interaction.editReply({ embeds: [embed] });

        const messages = await channel
          .awaitMessages({ filter, max: 1 })
          .catch(() => null);
        const msg = messages?.first();

        if (!messages || !msg) return;
        if (msg.content.toLocaleLowerCase() == "cancelar") {
          embed.setDescription("O anúncio foi cancelado!").setFooter(null);
          interaction.editReply({ embeds: [embed] });
        }

        answers.push({ name: current.text, value: msg.content });
        embed.setDescription("Sua resposta foi salva... \nPróxima pergunta");
        msg.delete().catch(() => {});

        quest(steps + 1);
        return;
      }

      interaction.channel?.send({
        embeds: [
          {
            title: answers[0].value,
            description: answers[1].value,
            url: answers[2].value,
            thumbnail: {
              url: answers[3].value,
              width: 50,
              height: 50,
            },
            fields: [{ name: answers[4].value, value: answers[5].value }],
          },
        ],
      });
    };

    await buttonInteraction.update({ components: [] });
    quest();
  },
});
