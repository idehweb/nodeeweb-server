import _ from "lodash";
import path from "path";
import fs from "fs";
import shell from 'shelljs';

export default (props = {}, app) => {
    return new Promise(function (resolve, reject) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => dirent.isDirectory())
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, async (item) => {
                let pluginPath = path.join(__dirname, "./plugins/", item.name, 'index.js');
                console.log('pluginPath', pluginPath)
                const {default: module} = await import(pluginPath);
                // _.forEach(dependencies(), (dep) => {
                //     shell.exec('npm install ' + dep, function (code, stdout, stderr) {
                //         console.log('code: ', code);
                //         console.log('stdout: ', stdout);
                //         console.log('stderr: ', stderr);
                //     })
                //
                // });
                props = module(props);

                // await console.log(dependencies());
                // item.path = '/' + item.name + '/index.js'
                // item.image = '/' + item.name + '/image.jpg'
                // item.active = '/' + item.name + '/image.jpg'
            })
            return resolve(props);
        });

    })
}