import * as fs from 'fs';

export async function isExists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch (err) {
    return false;
  }
}
export function isExistsSync(path) {
  return fs.existsSync(path);
}
