# Scaffolda

Simple, declarative file scaffolding

## Features

- Create files + folders from templates
- Compose commands for complex file/folder creation
- Uses template strings for template prop injection

> Note: Scaffolda is still in beta and the API is subject to change before the v1 release.

---

## Installation

```bash
# npm
npm i -D scaffolda

# yarn
yarn add --dev scaffolda
```

## Background

Scaffolda lets you define your own templates to easily standardize new file/folder scaffolding. Inspired by React's `createElement` function, Scaffolda collects any props you want to inject into your templates (passed via command line or from prompts) and then passes them down through your templates via the `scaffolda` function.

## Usage

Here's an example of a functional Scaffolda config that will create new components in the `/components` directory:

```js
// scaffolda.config.js
const { scaffolda, collectProps, createFile } = require('scaffolda');

// code template
const component = ({ name }) => `
  const ${name} = () => <div>This is the ${name} component</div>

  export default ${name};
`;

// file creator
const componentFile = createFile(component, (props) => `${props.name}.jsx`);

// allowed commands
const commands = [{ title: 'Component', value: 'component' }];

// function to handle commands
async function handleCommand(command) {
  if (command === 'component') {
    // collect props from user or CLI
    const props = await collectProps(() => [
      {
        type: 'text',
        name: 'name',
        message: 'What is the name of your component?',
      },
    ]);

    // run file scaffolding
    scaffolda('./components', props, componentFile);
  }
}

module.exports = () => ({
  commands,
  handleCommand,
});
```

Running `scaffolda`

```bash
  # run scaffolda without initial command (will prompt your for command)
  $ scaffolda

  # runs scaffolda with component command
  $ scaffolda component

  # run scaffolda with component command and eagerly pass in name prop
  $ scaffolda component --name=MyComponentName
```

Let's break down what's going on here.

First, create a `scaffolda.config.js` file at the root of your project. When you run `scaffolda` from the command line, it will use this file to determine what to scaffold. Scaffolda expects this file to have a default function export that returns an object with properties `commands` and `handleCommand`. Inside the `handleCommand` function, you can call the `scaffolda` function to perform the scaffolding.

### `commands`

- This option defines what commands are allowed. The value of the `commands` property must be a list of objects with `title` and `value` properties.

```js
// example
[
  {
    title: 'Component',
    value: 'component',
  },
  {
    title: 'Page',
    value: 'page',
  },
];
```

### `handleCommand`

- `handleCommand` is a function that accepts a single `command` argument (one of the commands you defined in `commands`). You can use this command to determine how to scaffold your files or folders. Generally, you'll have some conditional logic here that checks the command argument to determine what to run.

```js
// example
async function handleCommand(command) {
  if (command === 'component') {
    // collect any component props
    // perform component scaffolding...
  }
  if (command === 'page') {
    // collect any page props
    // perform page scaffolding
  }
}
```

### `collectProps`

- `collectProps` accepts a function that returns an array of prompt objects conforming to the [prompts](https://www.npmjs.com/package/prompts) API. It will automatically reconcile any props passed in via CLI args and only prompt you for any missing props. The return value is an promise object that resolves props you can pass down to your file or folder creators.

### Creating Files

```ts
  createFile(contentCreator: (props: P) => string, nameCreator: (props: P) => string): File;
```

`createFile` accepts two arguments: a function that returns a string (your template) and a second function that returns the name of your file. Both arguments have a `props` parameter.

### Creating Folders

```ts
  createFolder(folderChildren: FolderChildren[] | null, nameCreator: (props: P) => string): Folder;
```

`createFolder` accepts two arguments: a list of folder children if folder is not empty (`File` or `Folder` objects), otherwise `null`, and a second function that takes a single `props` argument and returns the name of your folder.

### Starting the Scaffold

```ts
  scaffolda(directory: string, props: any, createFileOrFolder: File | Folder | (File | Folder)[]) => void;
```

To actually start the scaffolding, invoke the `scaffolda` function and pass it the name of the directory to start the scaffolding, the props you've collected (via CLI arguments and prompts) and the `File` or `Folder` entity (or a list of `File`/`Folder` entities) to scaffold in the specified directory.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Follow the `changesets` [base workflow](https://github.com/changesets/changesets/blob/main/packages/cli/README.md#base-workflow) method to handle versioning.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
