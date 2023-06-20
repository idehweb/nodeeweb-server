import * as fs from 'fs';
import { getSharedPath } from './src/helpers/utils.mjs';

function prepare() {
  //   create shared directory
  if (!fs.existsSync(getSharedPath('.'))) fs.mkdirSync(getSharedPath('.'));
}

prepare();
