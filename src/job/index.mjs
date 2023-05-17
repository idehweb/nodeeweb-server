import fs from 'fs';
import { getSharedPath, wait } from '../helpers/utils.mjs';

export class SingleJobProcess {
  constructor(id, job) {
    this.id = id;
    this.job = job;
  }

  static builderAsync(id, job) {
    const jp = new SingleJobProcess(id, async () => {
      job();
      await wait(5);
    });
    return jp.runTask.bind(jp);
  }

  #block() {
    try {
      fs.writeFileSync(getSharedPath(`single-job-${this.id}`), '', {
        flag: 'wx',
      });
      return true;
    } catch (err) {
      return false;
    }
  }
  #free() {
    try {
      fs.rmSync(getSharedPath(`single-job-${this.id}`));
    } catch (err) {}
  }
  async runTask() {
    // block other process with same task id
    const canBlock = this.#block();
    if (!canBlock) return;

    // execute tasks
    try {
      await this.job();
    } catch (err) {}

    // free others
    this.#free();
  }
}
