import { join } from 'path';
export function getSharedPath(path) {
  return join(process.env.SHARED_PATH || '.', path);
}
export function wait(sec) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, sec * 1000)
  );
}
