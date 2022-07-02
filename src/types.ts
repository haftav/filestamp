import {} from 'prompts';

export interface Command {
  title: string;
  value: string;
}

export interface Config {
  commands: Command[];
  handleCommand: (command: string) => any;
}

export type Action = () => void;

interface ActionsCreatorParams<T> {
  currentDirectory: string;
  props: T;
  builder: Builder<T>;
}

export interface ActionsCreator<T> {
  (params: ActionsCreatorParams<T>): Action[];
}

export type Builder<T> = (
  directory: string,
  props: T,
  createActions: ActionsCreator<T> | ActionsCreator<T>[]
) => Action[];
