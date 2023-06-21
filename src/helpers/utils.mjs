import { join, resolve } from 'path';
import * as os from 'os';
import * as fs from 'fs';


export function getSharedPath(path) {
  return join(process.env.SHARED_PATH || '.', path);
}
export function getScriptFile(scriptName) {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) => resolve(appDirectory, relativePath);
  const scripts = resolveApp('./node_modules/@nodeeweb/server/scripts');
  return join(
    scripts,
    `${scriptName}.${os.platform() === 'win32' ? 'bat' : 'sh'}`
  );
}
export function wait(sec) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, sec * 1000)
  );
}
