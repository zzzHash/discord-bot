import {
  ApplicationCommandData,
  ButtonInteraction,
  Client,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

interface CommandProps {
  client: Client;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
}

export type ComponentsButton = Collection<
  string,
  (interaction: ButtonInteraction) => any
>;
export type ComponentsSelect = Collection<
  string,
  (interaction: StringSelectMenuInteraction) => any
>;
export type ComponentsModal = Collection<
  string,
  (interaction: ModalSubmitInteraction) => any
>;

interface CommandComponents {
  buttons?: ComponentsButton;
  selects?: ComponentsSelect;
  modals?: ComponentsModal;
}

export type CommandType = ApplicationCommandData &
  CommandComponents & {
    run(props: CommandProps): any;
  };

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false;
    Object.assign(this, options);
  }
}
