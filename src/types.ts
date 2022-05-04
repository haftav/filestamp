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
  type: 'FILE';
}

export interface FolderCreator<P = any> {
  (currentDirectory: string, props: P): { children: any[] | null; folderName: string };
  type: 'FOLDER';
}
