import {
  ApplicationCommandDataResolvable,
  BitFieldResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import {
  CommandType,
  ComponentsButton,
  ComponentsModal,
  ComponentsSelect,
} from "./type/command";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { EventType } from "./type/events";

const fileCondition = (filename: string) =>
  filename.endsWith(".ts") || filename.endsWith(".js");

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public selects: ComponentsSelect = new Collection();
  public modals: ComponentsModal = new Collection();
  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }
  public start() {
    this.registerEvents();
    this.registerModules();
    this.login(process.env.DISCORD_TOKEN);
  }
  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands
      .set(commands)
      .then(() => {
        console.log("✅ Slash commands (/) defined.");
      })
      .catch((error) => {
        console.log(
          `❌ An error ocurred while trying to set Slash Commands (/): \n${error}`
        );
      });
  }

  private registerModules() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

    const commandsPath = path.join(__dirname, "..", "commands");

    fs.readdirSync(commandsPath).forEach((local) => {
      fs.readdirSync(commandsPath + `/${local}/`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const command: CommandType = (
            await import(`../commands/${local}/${fileName}`)
          )?.default;
          const { name, buttons, selects, modals } = command;

          if (name) {
            this.commands.set(name, command);
            slashCommands.push(command);

            if (buttons)
              buttons.forEach((run, key) => this.buttons.set(key, run));
            if (selects)
              selects.forEach((run, key) => this.selects.set(key, run));
            if (modals) modals.forEach((run, key) => this.modals.set(key, run));
          }
        });
    });

    this.on("ready", () => this.registerCommands(slashCommands));
  }

  private registerEvents() {
    const evenstPath = path.join(__dirname, "..", "events");

    fs.readdirSync(evenstPath).forEach((local) => {
      fs.readdirSync(`${evenstPath}/${local}`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const { name, once, run }: EventType<keyof ClientEvents> = (
            await import(`../events/${local}/${fileName}`)
          )?.default;
          try {
            if (name) once ? this.once(name, run) : this.on(name, run);
          } catch (error) {
            console.log(`An error occurred on event: ${name} \n${error}`);
          }
        });
    });
  }
}
