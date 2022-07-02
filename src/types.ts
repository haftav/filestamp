import {} from 'prompts';

export interface Command {
  title: string;
  value: string;
}

export interface Config {
  commands: Command[];
  handleCommand: (command: string) => any;
}

export interface FileCreator<P = any> {
  (currentDirectory: string, props: P): void;
}

export interface FolderCreator<P = any> {
  (currentDirectory: string, props: P): void;
}

export interface CreatorType {
  action: (currentDirectory: string, props: any) => void;
  type: string;
  nameGetter: (props: any) => string;
  [x: string]: unknown;
}

export type Action = () => void;

interface ActionsCreatorParams<T> {
  currentDirectory: string;
  props: T;
}

export interface ActionsCreator<T> {
  (params: ActionsCreatorParams<T>): Action[];
}
