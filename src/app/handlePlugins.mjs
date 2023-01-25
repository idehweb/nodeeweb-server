import _ from "lodash";
import path from "path";
import fs from "fs";

export default (props = {}, app) => {
    return new Promise(function (resolve, reject) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        let p = 0
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    p++;
                    callback(
                        files
                            .filter(dirent => dirent.isDirectory())
                    )
                }
            })
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
                    let pluginPath = path.join(__dirname, "./plugins/", item.name, 'index.js');
                    // console.log('pluginPath', pluginPath,r,f.length)
                    const {default: module} = await import(pluginPath);
                    props = module(props);
                    r++;
                    // console.log('r is:', r)
                    if (r == f.length) {
                        // console.log('resolve this shit ,', r, f.length)
                        return resolve(props);
                    }

                })
            else
                return resolve(props);

        });

    })
}