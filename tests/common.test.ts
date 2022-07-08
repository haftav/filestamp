import path from 'path';
import { execSync } from 'child_process';

import { removeTestFiles } from './utils';

const executablePath = path.join(__dirname, '..', 'dist/cli.js');

interface CreateTestSuiteParams {
  moduleType: string;
  pathToDirectory: string;
  cwd: string;
}

export const createTestSuite = ({ moduleType, pathToDirectory, cwd }: CreateTestSuiteParams) => {
  beforeEach(() => removeTestFiles(pathToDirectory));
  afterEach(() => removeTestFiles(pathToDirectory));

  describe(`Tests for ${moduleType} type`, () => {
    it('Prompts for command if no command passed', () => {
      const result = execSync(`node ${executablePath}`, { cwd }).toString();
      expect(result).toContain('Please choose command you want to run');
    });

    it('Prompts for props if no props passed', () => {
      const result = execSync(`node ${executablePath} component`, { cwd }).toString();
      expect(result).toContain('What is the name of your component?');
    });

    it('Skips prompts if props are passed via CLI', () => {
      const result = execSync(`node ${executablePath} component --name=Test`, {
        cwd,
      }).toString();
      expect(result).toContain('How old are you?');
    });

    it('Skips all prompts if all props passed via CLI', () => {
      const result = execSync(
        `node ${executablePath} component --name=Test --age=27 --about="A random component"`,
        {
          cwd,
        }
      ).toString();
      expect(result).toContain('');
    });

    it('Prompts for props for collectProps array param', () => {
      const result = execSync(`node ${executablePath} folder-test`, { cwd }).toString();
      expect(result).toContain('What are you naming this resource?');
    });
  });
};
// just to avoid warning, that no tests in test file
describe('Common tests for CommonService implementations', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test('should be used per implementation', () => {});
});
