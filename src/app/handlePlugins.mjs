import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import os from 'os';

export default (props = {}, app) => {
  return new Promise(function (resolve, reject) {
    let __dirname = path.resolve();
    let pluginPath = path.join(__dirname, './plugins/');
    let p = 0;
    const getDirectories = (source, callback) =>
      fs.readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
          callback(err);
        } else {
          p++;
          callback(files.filter((dirent) => dirent.isDirectory()));
        }
      });
    //install dependencies
    //if it was not in package json

    //1. get package.json dep list
    //2. check if dep not found, install it...
    //3. if everything was ok ==> then run below code

    getDirectories(pluginPath, function (f) {
      // console.log('getDirectories...')
      let r = 0;
      if (f && f.length > 0)
        _.map(f, async (item) => {
          let pluginPath = `../../plugins/${item.name}/index.js`;
          if (item.name && item.name.indexOf('deactive') == -1) {
            const importedFile = await import(pluginPath);
            let module;
            if (os.platform() === 'win32') module = importedFile.default;
            else module = importedFile.default.default;
            props = module(props);
          }
          r++;
          if (r == f.length) {
            return resolve(props);
          }
        });
      else return resolve(props);
    });
  });
};
