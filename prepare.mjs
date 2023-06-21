import * as fs from 'fs';
import { getSharedPath } from './src/helpers/utils.mjs';
import path from 'path';

export const USE_ENV = {
  NPM: 'npm-install',
  GIT: 'git-clone',
};

function prepare() {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

  //   create shared directory
  if (!fs.existsSync(getSharedPath('.'))) fs.mkdirSync(getSharedPath('.'));

  // check use env
  const node_modules_ns = resolveApp('./node_modules/@nodeeweb/server/admin');
  if (fs.existsSync(node_modules_ns)) process.env.USE_ENV = USE_ENV.NPM;
  else process.env.USE_ENV = USE_ENV.GIT;
}

prepare();
