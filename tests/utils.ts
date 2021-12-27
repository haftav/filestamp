import fs from 'fs';

export function removeTestFiles(path: string) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
  }
}
