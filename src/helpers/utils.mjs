import { join } from 'path';
import { setTimeout } from 'timers/promises';
export function getSharedPath(path) {
  return join(process.env.SHARED_PATH || '.', path);
}
export async function wait(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}
