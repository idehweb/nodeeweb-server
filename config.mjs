import fs from 'fs';
import { getSharedPath } from './src/helpers/utils.mjs';
import global from './src/global.mjs';

class Config {
  constructor() {
    this.path = getSharedPath('config.json');
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify({}), { encoding: 'utf8' });
    }
    this.config = JSON.parse(
      fs.readFileSync(this.path, {
        encoding: 'utf8',
      })
    );
    this.#watch();
  }
  #watch() {
    fs.watchFile(this.path, async (curr) => {
      if (!curr.isFile()) return;
      try {
        this.config = JSON.parse(
          await fs.promises.readFile(this.path, {
            encoding: 'utf8',
          })
        );
        // update theme config
        global.updateThemeConfig(this.props);
        console.log('config change', this.config);
      } catch (err) {
        console.log('config watch error', err);
      }
    });
  }
  change(conf) {
    this.config = { ...this.config, ...conf };
  }
  add(key, value) {
    this.config[key] = { ...(this.config[key] ?? {}), ...value };
  }
  async write() {
    await fs.promises.writeFile(this.path, JSON.stringify(this.config), {
      encoding: 'utf8',
    });
  }
}

const config = new Config();
export default config;
