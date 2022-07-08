import path from 'path';

import { createTestSuite } from '../common.test';

const directoryName = '/samples';
const pathToDirectory = path.join(__dirname, directoryName);

createTestSuite({ moduleType: 'esm', pathToDirectory, cwd: __dirname });
